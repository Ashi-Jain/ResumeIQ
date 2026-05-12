import { useState } from "react";
import { Upload, FileText, Loader2, CheckCircle, XCircle } from "lucide-react";
import { parseFile, validateFile } from "../utils/fileParser";
import ollamaService from "../services/ollamaService";
import "./ATSAnalyzer.css";

function ATSAnalyzer({ onAnalysisComplete }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file);
      setError("");
      setLoading(true);

      const parsedData = await parseFile(file);
      setResumeFile(file);
      setResumeText(parsedData.text);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError("Please upload a resume first");
      return;
    }

    if (!jobDescriptionText) {
      setError("Please provide a job description");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const results = await ollamaService.analyzeResume(
        resumeText,
        jobDescriptionText,
      );
      setAnalysisResults(results);

      // Pass data to parent component
      onAnalysisComplete(
        results,
        { text: resumeText, file: resumeFile },
        jobDescriptionText,
      );

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4ade80";
    if (score >= 60) return "#fbbf24";
    return "#ef4444";
  };

  return (
    <div className="ats-analyzer">
      <div className="analyzer-container">
        {/* Resume Upload Section */}
        <div className="upload-section">
          <h2>📄 Upload Resume</h2>
          <div className="file-upload-area">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="file-input"
            />
            <label htmlFor="resume-upload" className="file-upload-label">
              <Upload size={48} />
              <p>Click to upload or drag and drop</p>
              <span>PDF, DOCX, or TXT (Max 10MB)</span>
            </label>
          </div>
          {resumeFile && (
            <div className="file-info">
              <CheckCircle size={20} color="#4ade80" />
              <span>{resumeFile.name}</span>
            </div>
          )}
        </div>

        {/* Job Description Section */}
        <div className="job-description-section">
          <h2>💼 Job Description</h2>
          <textarea
            className="job-description-textarea"
            placeholder="Paste the job description here..."
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            rows={10}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Analyze Button */}
        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={loading || !resumeText || !jobDescriptionText}
        >
          {loading ? (
            <>
              <Loader2 className="spinner" size={24} />
              Analyzing...
            </>
          ) : (
            <>🎯 Analyze ATS Score</>
          )}
        </button>

        {/* Results Section */}
        {analysisResults && (
          <div className="results-section">
            <h2>📊 Analysis Results</h2>

            {/* ATS Score */}
            <div className="score-card">
              <div
                className="score-circle"
                style={{ borderColor: getScoreColor(analysisResults.atsScore) }}
              >
                <span className="score-value">{analysisResults.atsScore}</span>
                <span className="score-label">ATS Score</span>
              </div>
            </div>

            {/* Keywords Section */}
            <div className="results-grid">
              <div className="result-card">
                <h3>✅ Matched Keywords</h3>
                <div className="keyword-list">
                  {analysisResults.matchedKeywords?.map((keyword, idx) => (
                    <span key={idx} className="keyword matched">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="result-card">
                <h3>❌ Missing Keywords</h3>
                <div className="keyword-list">
                  {analysisResults.missingKeywords?.map((keyword, idx) => (
                    <span key={idx} className="keyword missing">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="results-grid">
              <div className="result-card">
                <h3>💪 Strengths</h3>
                <ul className="bullet-list">
                  {analysisResults.strengths?.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="result-card">
                <h3>⚠️ Weaknesses</h3>
                <ul className="bullet-list">
                  {analysisResults.weaknesses?.map((weakness, idx) => (
                    <li key={idx}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Reviews */}
            <div className="detailed-reviews">
              <div className="review-card">
                <h3>🎯 Experience Alignment</h3>
                <div className="review-score">
                  Score:{" "}
                  <span
                    style={{
                      color: getScoreColor(
                        analysisResults.experienceAlignment?.score || 0,
                      ),
                    }}
                  >
                    {analysisResults.experienceAlignment?.score || 0}/100
                  </span>
                </div>
                <p>{analysisResults.experienceAlignment?.details}</p>
              </div>

              <div className="review-card">
                <h3>🚀 Project Review</h3>
                <div className="review-score">
                  Score:{" "}
                  <span
                    style={{
                      color: getScoreColor(
                        analysisResults.projectReview?.score || 0,
                      ),
                    }}
                  >
                    {analysisResults.projectReview?.score || 0}/100
                  </span>
                </div>
                <p>{analysisResults.projectReview?.feedback}</p>
              </div>

              <div className="review-card">
                <h3>📝 Summary Review</h3>
                <div className="review-score">
                  Score:{" "}
                  <span
                    style={{
                      color: getScoreColor(
                        analysisResults.summaryReview?.score || 0,
                      ),
                    }}
                  >
                    {analysisResults.summaryReview?.score || 0}/100
                  </span>
                </div>
                <p>{analysisResults.summaryReview?.feedback}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="result-card recommendations">
              <h3>💡 Recommendations</h3>
              <ul className="bullet-list">
                {analysisResults.recommendations?.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Verdict Card */}
            {analysisResults.verdict && (
              <div className="result-card verdict-card">
                <h3>🎯 Final Verdict</h3>
                <p>{analysisResults.verdict}</p>
              </div>
            )}

            {/* Skills Gap */}
            {analysisResults.skillsGap && (
              <div className="result-card skills-gap-card">
                <h3>⚠️ Skills Gap Analysis</h3>
                <div className="review-score">
                  Gap Score:{" "}
                  <span
                    style={{
                      color: getScoreColor(
                        100 - (analysisResults.skillsGap.score || 0),
                      ),
                    }}
                  >
                    {analysisResults.skillsGap.score || 0}%
                  </span>
                </div>
                <p>{analysisResults.skillsGap.feedback}</p>
              </div>
            )}

            {/* Optimization Suggestions */}
            {analysisResults.optimizationSuggestions && (
              <div className="result-card optimization-card">
                <h3>🔧 ATS Optimization Suggestions</h3>
                <p>{analysisResults.optimizationSuggestions}</p>
              </div>
            )}

            {/* Improved Bullets */}
            {analysisResults.improvedBullets && (
              <div className="result-card improved-bullets-card">
                <h3>✨ Improved Resume Bullets</h3>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
                  {analysisResults.improvedBullets}
                </p>
              </div>
            )}

            {/* Full Response if available */}
            {analysisResults.fullResponse && (
              <div className="result-card full-response">
                <h3>📋 Full AI Analysis</h3>
                <pre>{analysisResults.fullResponse}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ATSAnalyzer;
