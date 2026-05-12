# 🚀 Quick Start Guide

Get ResumeIQ up and running in 5 minutes!

## ⚡ Quick Setup (Windows)

### 1. Install Prerequisites (One-time setup)

**Install Node.js:**
- Download: https://nodejs.org/
- Run installer
- Restart terminal

**Install Ollama:**
- Download: https://ollama.ai/download/windows
- Run installer
- It starts automatically

**Install AI Model:**
```powershell
ollama pull llama2
```

### 2. Install & Run

```powershell
# Navigate to project
cd c:/ASHI/Project/ResumeIQ

# Install dependencies (first time only)
npm install

# Start Ollama (in a new terminal, keep it running)
ollama serve

# Start the app (in project terminal)
npm run dev
```

### 3. Open Browser

Go to: **http://localhost:3000**

---

## 🎯 Quick Test

### Test 1: ATS Analyzer
1. Click "ATS Analyzer" tab
2. Upload any PDF/DOCX resume
3. Paste a job description
4. Click "Analyze ATS Score"
5. Wait ~30 seconds for results

### Test 2: AI Chat
1. Click "AI Chat" tab
2. Ask: "How can I improve my resume?"
3. Get AI-powered advice

### Test 3: Templates
1. Click "Resume Templates" tab
2. Choose a template
3. Click "Edit Mode"
4. Modify your info
5. Export as PDF/DOCX

---

## 🔧 Troubleshooting

### "npm is not recognized"
→ Install Node.js and restart terminal

### "ollama is not recognized"
→ Install Ollama and restart terminal

### "Failed to connect to Ollama"
→ Run `ollama serve` in a separate terminal

### "Model not found"
→ Run `ollama pull llama2`

---

## 📝 Usage Tips

1. **First Analysis Takes Longer**: Initial AI response may take 60 seconds
2. **Keep Ollama Running**: Don't close the `ollama serve` terminal
3. **File Size Limit**: Max 10MB for resume uploads
4. **Supported Formats**: PDF, DOCX, TXT
5. **Internet Required**: Only for initial setup and PDF.js CDN

---

## 🎨 Features Overview

### Tab 1: ATS Analyzer
- Upload resume (PDF/DOCX/TXT)
- Input job description (text or URL)
- Get comprehensive ATS analysis:
  - ATS Score (0-100)
  - Missing & matched keywords
  - Strengths & weaknesses
  - Experience alignment
  - Project & summary reviews
  - Personalized recommendations

### Tab 2: AI Chat
- Ask questions about your resume
- Get career advice
- Resume optimization tips
- Context-aware responses
- Real-time streaming

### Tab 3: Resume Templates
- 4 professional templates
- Live editing
- Export to PDF/DOCX
- Fully customizable
- ATS-friendly designs

---

## 🚀 Next Steps

1. **Analyze Your Resume**: Upload your actual resume and a real job description
2. **Chat with AI**: Ask specific questions about improvements
3. **Create New Resume**: Use templates to build an ATS-optimized resume
4. **Iterate**: Keep improving based on AI feedback

---

## 📚 Need More Help?

- **Detailed Setup**: See `SETUP_GUIDE.md`
- **Full Documentation**: See `README.md`
- **Issues**: Check browser console and Ollama terminal

---

## ⚙️ System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 8GB minimum (16GB recommended for larger models)
- **Storage**: 5GB free space
- **Internet**: Required for initial setup

---

## 🎯 Pro Tips

### For Faster Responses:
```bash
ollama pull mistral  # Smaller, faster model
```
Then update `src/services/ollamaService.js`:
```javascript
this.model = 'mistral'
```

### For Better Quality:
```bash
ollama pull llama2:13b  # Larger, better model (needs 16GB RAM)
```

### Multiple Models:
You can install multiple models and switch between them!

---

**Ready to optimize your resume? Let's go! 🎯**