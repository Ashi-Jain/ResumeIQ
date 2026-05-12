# ResumeIQ Setup Guide

This guide will help you set up and run the ResumeIQ ATS Tracker System on your local machine.

## Prerequisites

### 1. Install Node.js

Download and install Node.js (v16 or higher) from:
- **Windows/Mac/Linux**: https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Ollama

Ollama is required for AI functionality.

#### Windows
1. Download from: https://ollama.ai/download/windows
2. Run the installer
3. Ollama will start automatically

#### Mac
```bash
curl https://ollama.ai/install.sh | sh
```

#### Linux
```bash
curl https://ollama.ai/install.sh | sh
```

Verify Ollama installation:
```bash
ollama --version
```

### 3. Install an AI Model

Install the recommended model (llama2):
```bash
ollama pull llama2
```

Other available models:
```bash
ollama pull mistral        # Faster, good for chat
ollama pull codellama      # Better for code-related tasks
ollama pull llama2:13b     # More powerful, requires more RAM
```

List installed models:
```bash
ollama list
```

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd c:/ASHI/Project/ResumeIQ
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React Router
- PDF and DOCX parsing libraries
- Export libraries (jsPDF, docx)
- UI components (lucide-react)
- And more...

### Step 3: Start Ollama Server

Open a new terminal and run:
```bash
ollama serve
```

Keep this terminal running. You should see:
```
Ollama is running on http://localhost:11434
```

### Step 4: Start the Development Server

In your project terminal, run:
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 5: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Troubleshooting

### Issue: "npm is not recognized"

**Solution**: Node.js is not installed or not in PATH
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/command prompt
3. Verify with `node --version`

### Issue: "ollama is not recognized"

**Solution**: Ollama is not installed or not in PATH
1. Install Ollama from https://ollama.ai
2. Restart your terminal
3. Verify with `ollama --version`

### Issue: "Failed to connect to Ollama"

**Solution**: Ollama server is not running
1. Open a new terminal
2. Run `ollama serve`
3. Keep it running while using the app

### Issue: "Model not found"

**Solution**: AI model is not installed
1. Run `ollama pull llama2`
2. Wait for download to complete
3. Verify with `ollama list`

### Issue: Port 3000 is already in use

**Solution**: Another application is using port 3000
1. Stop the other application, or
2. Edit `vite.config.js` and change the port:
```javascript
server: {
  port: 3001, // Change to any available port
}
```

### Issue: Dependencies installation fails

**Solution**: Clear npm cache and retry
```bash
npm cache clean --force
npm install
```

### Issue: PDF parsing not working

**Solution**: PDF.js worker not loading
- The app uses CDN for PDF.js worker
- Ensure you have internet connection
- Check browser console for errors

## Testing the Application

### Test ATS Analyzer

1. Go to "ATS Analyzer" tab
2. Upload a sample resume (create a simple PDF/DOCX with your info)
3. Paste a job description
4. Click "Analyze ATS Score"
5. Wait for AI analysis (may take 30-60 seconds)

### Test AI Chat

1. Go to "AI Chat" tab
2. Type a question like "How can I improve my resume?"
3. Wait for streaming response
4. Try suggested questions

### Test Resume Templates

1. Go to "Resume Templates" tab
2. Select a template
3. Click "Edit Mode"
4. Modify information
5. Click "Export as PDF" or "Export as DOCX"

## Performance Tips

### For Faster AI Responses

1. Use a smaller model:
```bash
ollama pull mistral
```

2. Update `src/services/ollamaService.js`:
```javascript
constructor() {
  this.model = 'mistral' // Faster than llama2
}
```

### For Better Quality Responses

1. Use a larger model (requires 16GB+ RAM):
```bash
ollama pull llama2:13b
```

2. Update the model in `ollamaService.js`

### Reduce Memory Usage

1. Close other applications
2. Use smaller AI models
3. Limit browser tabs

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new dependency
npm install package-name

# Update dependencies
npm update
```

## File Structure Overview

```
ResumeIQ/
├── src/
│   ├── components/          # React components
│   │   ├── ATSAnalyzer.jsx  # Tab 1: ATS Analysis
│   │   ├── AIChat.jsx       # Tab 2: AI Chat
│   │   └── TemplateEditor.jsx # Tab 3: Templates
│   ├── services/
│   │   └── ollamaService.js # Ollama API integration
│   ├── utils/
│   │   └── fileParser.js    # File parsing utilities
│   └── App.jsx              # Main app component
├── public/                  # Static assets
├── package.json             # Dependencies
└── vite.config.js          # Vite configuration
```

## Next Steps

1. **Customize Templates**: Edit `TemplateEditor.jsx` to add more templates
2. **Improve AI Prompts**: Modify prompts in `ollamaService.js` for better results
3. **Add Features**: Extend functionality as needed
4. **Deploy**: Build and deploy to hosting service

## Getting Help

- Check the main README.md for detailed documentation
- Review browser console for error messages
- Check Ollama logs in the terminal
- Ensure all prerequisites are installed

## Common Questions

**Q: How long does analysis take?**
A: Usually 30-60 seconds depending on your hardware and model size.

**Q: Can I use a different AI model?**
A: Yes! Install any Ollama model and update `ollamaService.js`.

**Q: Does this work offline?**
A: Yes! Once Ollama and models are installed, everything runs locally.

**Q: Can I customize the templates?**
A: Absolutely! Edit the CSS and JSX files in the components folder.

**Q: How do I update the app?**
A: Pull latest changes and run `npm install` to update dependencies.

---

Happy job hunting! 🎯