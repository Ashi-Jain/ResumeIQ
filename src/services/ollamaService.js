import axios from "axios";

const OLLAMA_API_URL = "http://localhost:11434/api";

class OllamaService {
  constructor() {
    this.model = "llama2"; // Default model, can be changed
  }

  async generateResponse(prompt, systemPrompt = "") {
    try {
      const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
        model: this.model,
        prompt: prompt,
        system: systemPrompt,
        stream: false,
      });
      return response.data.response;
    } catch (error) {
      console.error("Ollama API Error:", error);
      throw new Error(
        "Failed to connect to Ollama. Make sure Ollama is running on localhost:11434",
      );
    }
  }

  async analyzeResume(resumeText, jobDescription) {
    const systemPrompt = `You are an advanced Applicant Tracking System (ATS) with deep expertise in recruitment, technology, and data science hiring. Provide detailed, structured analysis focusing on ATS screening logic, keywords, relevance, and measurable impact.`;

    const prompt = `You are an advanced Applicant Tracking System (ATS) with deep expertise in recruitment, technology, and data science hiring.

Your task is to evaluate a candidate's resume against a given job description and provide a detailed, structured analysis.

### INPUT:

**Job Description:**
${jobDescription}

**Resume:**
${resumeText}

---

### OUTPUT REQUIREMENTS:

**1. Match Score (0–100%)**
* Provide an overall ATS match score.
* Brief explanation of how the score was calculated.

**2. Keyword Match Analysis**
* List important keywords from the job description.
* Identify which keywords are:
  * ✅ Present in resume
  * ❌ Missing from resume

**3. Skills Gap Analysis**
* Highlight missing technical and soft skills.
* Mention critical vs optional gaps.

**4. Experience Alignment**
* Evaluate how well the candidate's experience aligns with the role.
* Give a score from 0-100.
* Identify relevant vs irrelevant experience.

**5. Project Review**
* Review how well the candidate's projects support this role.
* Give a score from 0-100.
* Mention project relevance, technical depth, and measurable impact.

**6. Summary Review**
* Review the resume summary or profile section if present.
* Give a score from 0-100.
* If the summary is missing, say that clearly and explain the impact.

**7. Strengths**
* List top 3-5 strengths of the resume for this role.

**8. Weaknesses / Risks**
* Identify potential concerns (e.g., missing skills, short tenure, lack of impact metrics).

**9. ATS Optimization Suggestions**
* Provide specific, actionable improvements:
  * Resume keywords to add
  * Bullet point rewrites (if needed)
  * Formatting improvements for ATS compatibility

**10. Final Verdict**
* One of: Strong Match / Moderate Match / Weak Match
* Short justification.

**11. Improved Resume Bullets (Bonus)**
* Rewrite 2–3 resume bullet points to better match the job description using industry-relevant terminology and measurable impact.

---

### RULES:

* Be precise and data-driven.
* Avoid generic feedback.
* Focus on ATS screening logic (keywords, relevance, measurable impact).
* Prioritize technical roles (software, AI, data science) when applicable.
* Suggest improvements using industry-relevant terminology.

IMPORTANT:
Start directly from "1. Match Score".
Do NOT include introductory or explanatory text.
Use numbered headings exactly in the format "1. Match Score", "2. Keyword Match Analysis", etc.
For keyword lists, include explicit subheadings "Present in resume:" and "Missing from resume:".
Do NOT describe the system or mention ATS perspective.`;

    try {
      const response = await this.generateResponse(prompt, systemPrompt);

      // Parse the structured response
      return this.parseAdvancedAnalysis(response);
    } catch (error) {
      console.error("Analysis error:", error);
      throw error;
    }
  }

  parseAdvancedAnalysis(responseText) {
    const sections = this.extractNumberedSections(responseText);
    const analysis = {
      fullResponse: responseText,
      matchScore: this.extractScore(responseText),
      keywordAnalysis: this.extractKeywords(responseText),
      skillsGap:
        sections["3. Skills Gap Analysis"] ||
        this.extractSection(responseText, "3. Skills Gap Analysis"),
      experienceAlignment:
        sections["4. Experience Alignment"] ||
        this.extractSection(responseText, "4. Experience Alignment"),
      projectReview:
        sections["5. Project Review"] ||
        this.extractSection(responseText, "5. Project Review"),
      summaryReview:
        sections["6. Summary Review"] ||
        this.extractSection(responseText, "6. Summary Review"),
      strengths:
        this.extractBulletPointsFromText(sections["7. Strengths"]) ||
        this.extractBulletPoints(responseText, "7. Strengths") ||
        this.extractBulletPoints(responseText, "5. Strengths"),
      weaknesses:
        this.extractBulletPointsFromText(sections["8. Weaknesses / Risks"]) ||
        this.extractBulletPoints(responseText, "8. Weaknesses / Risks") ||
        this.extractBulletPoints(responseText, "6. Weaknesses"),
      optimizationSuggestions:
        sections["9. ATS Optimization Suggestions"] ||
        this.extractSection(responseText, "9. ATS Optimization Suggestions") ||
        this.extractSection(responseText, "7. ATS Optimization Suggestions"),
      verdict:
        sections["10. Final Verdict"] ||
        this.extractSection(responseText, "10. Final Verdict") ||
        this.extractSection(responseText, "8. Final Verdict"),
      improvedBullets:
        sections["11. Improved Resume Bullets (Bonus)"] ||
        sections["11. Improved Resume Bullets"] ||
        this.extractSection(responseText, "11. Improved Resume Bullets") ||
        this.extractSection(responseText, "9. Improved Resume Bullets"),
    };

    return this.mapToLegacyFormat(analysis);
  }

  extractScore(text) {
    const scoreMatch = text.match(
      /(?:Match Score|ATS match score)(?:\s*\([^)]+\))?[:\s-]*?(\d{1,3})(?:\/100|%|$)/i,
    );
    return scoreMatch ? parseInt(scoreMatch[1]) : 75;
  }

  extractKeywords(text) {
    const keywordSection =
      this.extractNumberedSections(text)["2. Keyword Match Analysis"] || text;
    const presentMatch = keywordSection.match(
      /(?:✅\s*)?Present in resume[:\s]*([\s\S]*?)(?=(?:❌\s*)?Missing from resume[:\s]*|$)/i,
    );
    const missingMatch = keywordSection.match(
      /(?:❌\s*)?Missing from resume[:\s]*([\s\S]*?)$/i,
    );

    const present = presentMatch
      ? this.normalizeKeywordList(presentMatch[1])
      : [];

    const missing = missingMatch
      ? this.normalizeKeywordList(missingMatch[1])
      : [];

    return { present, missing };
  }

  extractBulletPoints(text, section) {
    const regex = new RegExp(
      `${this.escapeRegExp(section)}[:\\s]*([\\s\\S]*?)(?=\\n\\s*(?:\\*\\*)?\\d+\\.\\s|$)`,
      "i",
    );
    const match = text.match(regex);

    if (!match) return [];

    return this.extractBulletPointsFromText(match[1]);
  }

  extractSection(text, section) {
    const regex = new RegExp(
      `${this.escapeRegExp(section)}[:\\s]*([\\s\\S]*?)(?=\\n\\s*(?:\\*\\*)?\\d+\\.\\s|$)`,
      "i",
    );
    const match = text.match(regex);

    return match ? match[1].trim() : "";
  }

  mapToLegacyFormat(analysis) {
    return {
      atsScore: analysis.matchScore,
      matchedKeywords: analysis.keywordAnalysis.present,
      missingKeywords: analysis.keywordAnalysis.missing,
      strengths: this.parseList(analysis.strengths),
      weaknesses: this.parseList(analysis.weaknesses),
      experienceAlignment: {
        score: this.extractSectionScore(analysis.experienceAlignment),
        details: analysis.experienceAlignment,
      },
      projectReview: {
        score: this.extractSectionScore(analysis.projectReview),
        feedback: analysis.projectReview,
      },
      summaryReview: {
        score: this.extractSectionScore(analysis.summaryReview),
        feedback: analysis.summaryReview,
      },
      skillsGap: {
        score: 100 - analysis.matchScore,
        feedback: analysis.skillsGap,
      },
      recommendations: this.parseList(analysis.optimizationSuggestions),
      optimizationSuggestions: analysis.optimizationSuggestions,
      verdict: analysis.verdict,
      improvedBullets: analysis.improvedBullets,
      fullResponse: analysis.fullResponse,
    };
  }

  parseList(text) {
    if (!text) return [];
    if (Array.isArray(text)) return text;

    return text
      .split(/\n/)
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^[\s*\-•]+/, "").trim())
      .filter((line) => line.length > 0);
  }

  extractNumberedSections(text) {
    const sectionRegex =
      /(?:^|\n)\s*(?:\*\*)?(\d+\.\s+[^\n:*]+(?:\([^)\n]+\))?)(?:\*\*)?\s*:?\s*\n([\s\S]*?)(?=\n\s*(?:\*\*)?\d+\.\s+[^\n]+(?:\*\*)?\s*:?\s*\n|$)/g;
    const sections = {};
    let match;

    while ((match = sectionRegex.exec(text)) !== null) {
      const title = match[1].trim();
      sections[title] = match[2].trim();
    }

    return sections;
  }

  extractBulletPointsFromText(text = "") {
    const bulletLines = text
      .split(/\n/)
      .map((line) => line.trim())
      .filter(
        (line) =>
          /^[*\-•]\s+/.test(line) || /^\d+\.\s+/.test(line),
      )
      .map((line) => line.replace(/^(?:[*\-•]|\d+\.)\s+/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 10);

    return bulletLines.length > 0 ? bulletLines : [];
  }

  normalizeKeywordList(text = "") {
    return text
      .split(/\n|,|•|\||;/)
      .map((item) => item.replace(/^(?:[*\-•]|\d+\.)\s+/, "").trim())
      .filter((item) => item.length > 0)
      .slice(0, 12);
  }

  extractSectionScore(text = "") {
    const directMatch = text.match(/(?:score|rating)[:\s-]*(\d{1,3})(?:\/100|%|$)/i);
    if (directMatch) {
      return Math.max(0, Math.min(100, parseInt(directMatch[1])));
    }

    return this.calculateAlignmentScore(text);
  }

  calculateAlignmentScore(text) {
    if (!text) return 0;

    const strongIndicators = [
      "strong",
      "excellent",
      "perfect",
      "complete",
      "full",
      "all",
    ];
    const mediumIndicators = [
      "good",
      "moderate",
      "partial",
      "some",
      "relevant",
    ];
    const weakIndicators = ["weak", "poor", "missing", "gaps", "limited"];

    const textLower = text.toLowerCase();

    if (strongIndicators.some((ind) => textLower.includes(ind))) return 85;
    if (mediumIndicators.some((ind) => textLower.includes(ind))) return 65;
    if (weakIndicators.some((ind) => textLower.includes(ind))) return 45;

    return 60;
  }

  escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  createFallbackAnalysis(responseText) {
    // Create a structured response if parsing fails
    return {
      atsScore: 75,
      missingKeywords: ["Extract from response"],
      matchedKeywords: ["Based on analysis"],
      strengths: ["Analysis provided by AI"],
      weaknesses: ["See detailed feedback"],
      experienceAlignment: {
        score: 70,
        details: responseText.substring(0, 200),
      },
      skillsGap: {
        score: 30,
        feedback: "See full analysis",
      },
      recommendations: ["Review full AI response for details"],
      verdict: "See detailed analysis",
      fullResponse: responseText,
    };
  }

  async chatWithContext(message, context) {
    const systemPrompt = `You are a helpful AI assistant specialized in resume optimization and career advice. You have access to the user's resume and job description.`;

    let contextInfo = "";
    if (context.resumeData) {
      contextInfo += `\n\nRESUME CONTEXT:\n${context.resumeData.text || "Resume uploaded"}`;
    }
    if (context.jobDescription) {
      contextInfo += `\n\nJOB DESCRIPTION:\n${context.jobDescription}`;
    }
    if (context.analysisResults) {
      contextInfo += `\n\nPREVIOUS ANALYSIS:\nATS Score: ${context.analysisResults.atsScore}/100`;
    }

    const prompt = `${contextInfo}\n\nUSER QUESTION: ${message}\n\nProvide a helpful and detailed response.`;

    return await this.generateResponse(prompt, systemPrompt);
  }

  async streamChat(message, context, onChunk) {
    try {
      const systemPrompt = `You are a helpful AI assistant specialized in resume optimization and career advice.`;

      let contextInfo = "";
      if (context.resumeData) {
        contextInfo += `\n\nRESUME CONTEXT:\n${context.resumeData.text || "Resume uploaded"}`;
      }
      if (context.jobDescription) {
        contextInfo += `\n\nJOB DESCRIPTION:\n${context.jobDescription}`;
      }

      const prompt = `${contextInfo}\n\nUSER QUESTION: ${message}\n\nProvide a helpful response.`;

      const response = await fetch(`${OLLAMA_API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          system: systemPrompt,
          stream: true,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              onChunk(json.response);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      throw error;
    }
  }

  setModel(modelName) {
    this.model = modelName;
  }
}

export default new OllamaService();

export const extractTextFromURL = async (url) => {
  try {
    // Use CORS proxy
    const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    const response = await fetch(corsProxyUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch content from URL");
    }

    const html = await response.text();

    // Basic HTML to text conversion
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove script and style elements
    const scripts = doc.querySelectorAll("script, style");
    scripts.forEach((script) => script.remove());

    return doc.body.textContent || doc.body.innerText || "";
  } catch (error) {
    throw new Error("Failed to fetch content from URL: " + error.message);
  }
};
