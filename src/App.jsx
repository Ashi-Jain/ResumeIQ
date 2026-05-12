import { useState } from "react";
import ATSAnalyzer from "./components/ATSAnalyzer";
import AIChat from "./components/AIChat";
import TemplateEditor from "./components/TemplateEditor";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [resumeData, setResumeData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);

  const tabs = [
    { id: "analyzer", label: "ATS Analyzer", icon: "📊" },
    { id: "chat", label: "AI Chat", icon: "💬" },
    { id: "templates", label: "Resume Templates", icon: "📄" },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎯 ResumeIQ</h1>
          <p>AI-Powered ATS Tracker System</p>
        </div>
      </header>

      <nav className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === "analyzer" && (
          <ATSAnalyzer
            onAnalysisComplete={(results, resume, jd) => {
              setAnalysisResults(results);
              setResumeData(resume);
              setJobDescription(jd);
            }}
          />
        )}
        {activeTab === "chat" && (
          <AIChat
            resumeData={resumeData}
            jobDescription={jobDescription}
            analysisResults={analysisResults}
          />
        )}
        {activeTab === "templates" && (
          <TemplateEditor resumeData={resumeData} />
        )}
      </main>
    </div>
  );
}

export default App;
