import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import ollamaService from "../services/ollamaService";
import "./AIChat.css";

function AIChat({ resumeData, jobDescription, analysisResults }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you with resume optimization, career advice, and answer questions about your ATS analysis. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setError("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      setLoading(true);

      // Prepare context
      const context = {
        resumeData,
        jobDescription,
        analysisResults,
      };

      // Add placeholder for assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", isStreaming: true },
      ]);

      let fullResponse = "";

      // Stream response
      await ollamaService.streamChat(userMessage, context, (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: fullResponse,
            isStreaming: true,
          };
          return newMessages;
        });
      });

      // Mark streaming as complete
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: fullResponse,
          isStreaming: false,
        };
        return newMessages;
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      // Remove the placeholder message
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How can I improve my ATS score?",
    "What keywords should I add to my resume?",
    "How does my experience align with the job?",
    "Can you review my resume summary?",
    "What are the main weaknesses in my resume?",
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="ai-chat">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-info">
            <Bot size={32} />
            <div>
              <h2>AI Assistant</h2>
              <p>Ask me anything about your resume and job application</p>
            </div>
          </div>
          {!resumeData && (
            <div className="context-warning">
              <AlertCircle size={16} />
              <span>
                Upload a resume in the ATS Analyzer tab for better context
              </span>
            </div>
          )}
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === "user" ? (
                  <User size={24} />
                ) : (
                  <Bot size={24} />
                )}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {message.content}
                  {message.isStreaming && <span className="cursor">▊</span>}
                </div>
              </div>
            </div>
          ))}
          {error && (
            <div className="error-message-chat">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="suggested-questions">
            <p className="suggested-label">Suggested questions:</p>
            <div className="suggestions-grid">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            disabled={loading}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={loading || !inputMessage.trim()}
          >
            {loading ? (
              <Loader2 className="spinner" size={24} />
            ) : (
              <Send size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
