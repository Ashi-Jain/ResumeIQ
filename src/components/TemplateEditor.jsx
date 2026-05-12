import { useState } from "react";
import { Download, Edit3, Eye, FileText } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./TemplateEditor.css";

function TemplateEditor({ resumeData }) {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    title: "Software Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    summary:
      "Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable applications and solving complex problems.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        duration: "Jan 2021 - Present",
        description:
          "• Led development of microservices architecture\n• Improved system performance by 40%\n• Mentored junior developers",
      },
      {
        title: "Software Engineer",
        company: "StartUp Inc",
        location: "Remote",
        duration: "Jun 2019 - Dec 2020",
        description:
          "• Developed RESTful APIs using Node.js\n• Implemented CI/CD pipelines\n• Collaborated with cross-functional teams",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of Technology",
        location: "Boston, MA",
        duration: "2015 - 2019",
        gpa: "3.8/4.0",
      },
    ],
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "MongoDB",
      "PostgreSQL",
    ],
    projects: [
      {
        name: "E-Commerce Platform",
        description:
          "Built a full-stack e-commerce platform with React and Node.js",
        technologies: "React, Node.js, MongoDB, Stripe",
        link: "github.com/johndoe/ecommerce",
      },
    ],
  });

  const templates = [
    {
      id: "modern",
      name: "Modern",
      icon: "🎨",
      description: "Clean and contemporary design",
    },
    {
      id: "professional",
      name: "Professional",
      icon: "💼",
      description: "Traditional corporate style",
    },
    {
      id: "creative",
      name: "Creative",
      icon: "✨",
      description: "Bold and eye-catching",
    },
    {
      id: "minimal",
      name: "Minimal",
      icon: "📄",
      description: "Simple and elegant",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayItemChange = (arrayName, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addArrayItem = (arrayName, template) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const exportToPDF = async () => {
    const element = document.getElementById("resume-preview");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
    );
    pdf.save(`${formData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  const exportToDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: formData.fullName,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: formData.title,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun(
                  `${formData.email} | ${formData.phone} | ${formData.location}`,
                ),
              ],
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "PROFESSIONAL SUMMARY",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: formData.summary,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "EXPERIENCE",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            ...formData.experience.flatMap((exp) => [
              new Paragraph({
                text: exp.title,
                bold: true,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: `${exp.company} | ${exp.location} | ${exp.duration}`,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: exp.description,
                spacing: { after: 300 },
              }),
            ]),
            new Paragraph({
              text: "EDUCATION",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            ...formData.education.flatMap((edu) => [
              new Paragraph({
                text: edu.degree,
                bold: true,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: `${edu.school} | ${edu.location} | ${edu.duration}`,
                spacing: { after: 300 },
              }),
            ]),
            new Paragraph({
              text: "SKILLS",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: formData.skills.join(" • "),
              spacing: { after: 400 },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${formData.fullName.replace(/\s+/g, "_")}_Resume.docx`);
  };

  return (
    <div className="template-editor">
      <div className="editor-header">
        <h2>📄 Resume Templates</h2>
        <div className="editor-actions">
          <button
            className={`action-button ${editMode ? "active" : ""}`}
            onClick={() => setEditMode(!editMode)}
          >
            <Edit3 size={20} />
            {editMode ? "View Mode" : "Edit Mode"}
          </button>
          <button
            className={`action-button ${previewMode ? "active" : ""}`}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye size={20} />
            Preview
          </button>
        </div>
      </div>

      <div className="template-selector">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="template-icon">{template.icon}</div>
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>
        ))}
      </div>

      <div className="editor-container">
        {editMode && (
          <div className="editor-panel">
            <div className="editor-section">
              <h3>Personal Information</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Professional Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="editor-section">
              <h3>Professional Summary</h3>
              <textarea
                placeholder="Write a brief summary..."
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                rows={4}
              />
            </div>

            <div className="editor-section">
              <h3>Experience</h3>
              {formData.experience.map((exp, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "experience",
                        index,
                        "title",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "experience",
                        index,
                        "company",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "experience",
                        index,
                        "location",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "experience",
                        index,
                        "duration",
                        e.target.value,
                      )
                    }
                  />
                  <textarea
                    placeholder="Description (use • for bullet points)"
                    value={exp.description}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "experience",
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                    rows={3}
                  />
                  <button
                    className="remove-button"
                    onClick={() => removeArrayItem("experience", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-button"
                onClick={() =>
                  addArrayItem("experience", {
                    title: "",
                    company: "",
                    location: "",
                    duration: "",
                    description: "",
                  })
                }
              >
                + Add Experience
              </button>
            </div>

            <div className="editor-section">
              <h3>Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "education",
                        index,
                        "degree",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "education",
                        index,
                        "school",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={edu.location}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "education",
                        index,
                        "location",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={edu.duration}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "education",
                        index,
                        "duration",
                        e.target.value,
                      )
                    }
                  />
                  <button
                    className="remove-button"
                    onClick={() => removeArrayItem("education", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-button"
                onClick={() =>
                  addArrayItem("education", {
                    degree: "",
                    school: "",
                    location: "",
                    duration: "",
                  })
                }
              >
                + Add Education
              </button>
            </div>

            <div className="editor-section">
              <h3>Skills</h3>
              <input
                type="text"
                placeholder="Enter skills separated by commas"
                value={formData.skills.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "skills",
                    e.target.value.split(",").map((s) => s.trim()),
                  )
                }
              />
            </div>
          </div>
        )}

        {previewMode && (
          <div className="preview-panel">
            <div
              id="resume-preview"
              className={`resume-template ${selectedTemplate}`}
            >
              <div className="resume-header">
                <h1>{formData.fullName}</h1>
                <h2>{formData.title}</h2>
                <div className="contact-info">
                  <span>{formData.email}</span>
                  <span>{formData.phone}</span>
                  <span>{formData.location}</span>
                </div>
              </div>

              <div className="resume-section">
                <h3>PROFESSIONAL SUMMARY</h3>
                <p>{formData.summary}</p>
              </div>

              <div className="resume-section">
                <h3>EXPERIENCE</h3>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div className="item-header">
                      <strong>{exp.title}</strong>
                      <span>{exp.duration}</span>
                    </div>
                    <div className="item-subheader">
                      {exp.company} | {exp.location}
                    </div>
                    <div className="item-description">
                      {exp.description.split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="resume-section">
                <h3>EDUCATION</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <div className="item-header">
                      <strong>{edu.degree}</strong>
                      <span>{edu.duration}</span>
                    </div>
                    <div className="item-subheader">
                      {edu.school} | {edu.location}
                    </div>
                  </div>
                ))}
              </div>

              <div className="resume-section">
                <h3>SKILLS</h3>
                <div className="skills-grid">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="export-buttons">
              <button className="export-button pdf" onClick={exportToPDF}>
                <Download size={20} />
                Export as PDF
              </button>
              <button className="export-button docx" onClick={exportToDOCX}>
                <FileText size={20} />
                Export as DOCX
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateEditor;
