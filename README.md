# ResumeIQ - ATS Tracker System

An AI-powered ATS (Applicant Tracking System) tracker built with React and Ollama. This application helps job seekers optimize their resumes for ATS systems, provides AI-powered career advice, and offers professional resume templates.

## Features

### 🎯 Tab 1: ATS Analyzer
- **Resume Upload**: Support for PDF, DOCX, and TXT files
- **Job Description Input**: Paste text or fetch from URL
- **Comprehensive Analysis**:
  - ATS Score (0-100)
  - Missing Keywords identification
  - Matched Keywords
  - Strengths & Weaknesses
  - Experience Alignment score
  - Project Review
  - Summary Review
  - Personalized Recommendations

### 💬 Tab 2: AI Chat
- Interactive AI assistant powered by Ollama
- Context-aware conversations about your resume and job description
- Real-time streaming responses
- Suggested questions to get started
- Career advice and resume optimization tips

### 📄 Tab 3: Resume Templates
- **4 Professional Templates**:
  - Modern: Clean and contemporary design
  - Professional: Traditional corporate style
  - Creative: Bold and eye-catching
  - Minimal: Simple and elegant
- **Live Editing**: Edit resume content in real-time
- **Export Options**:
  - Download as PDF
  - Download as DOCX
- **Fully Customizable**: Edit all sections including personal info, experience, education, skills, and projects

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher) installed
2. **Ollama** installed and running locally
   - Download from: https://ollama.ai
   - Install a model: `ollama pull llama2`
   - Start Ollama: `ollama serve`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ResumeIQ
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Setting up Ollama

1. Install Ollama from https://ollama.ai
2. Pull a model (recommended: llama2):
```bash
ollama pull llama2
```

3. Start Ollama server:
```bash
ollama serve
```

The application will connect to Ollama at `http://localhost:11434`

### Using the ATS Analyzer

1. Navigate to the "ATS Analyzer" tab
2. Upload your resume (PDF, DOCX, or TXT)
3. Paste the job description or enter a URL
4. Click "Analyze ATS Score"
5. Review the comprehensive analysis results

### Using the AI Chat

1. Navigate to the "AI Chat" tab
2. Ask questions about your resume, job description, or career advice
3. Get real-time AI-powered responses
4. Use suggested questions for quick insights

### Using Resume Templates

1. Navigate to the "Resume Templates" tab
2. Choose from 4 professional templates
3. Click "Edit Mode" to modify content
4. Update your information in real-time
5. Preview changes instantly
6. Export as PDF or DOCX when ready

## Project Structure

```
ResumeIQ/
├── src/
│   ├── components/
│   │   ├── ATSAnalyzer.jsx       # ATS analysis component
│   │   ├── ATSAnalyzer.css
│   │   ├── AIChat.jsx            # AI chat interface
│   │   ├── AIChat.css
│   │   ├── TemplateEditor.jsx    # Resume template editor
│   │   └── TemplateEditor.css
│   ├── services/
│   │   └── ollamaService.js      # Ollama API integration
│   ├── utils/
│   │   └── fileParser.js         # File parsing utilities
│   ├── App.jsx                   # Main application component
│   ├── App.css
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Ollama**: Local AI model integration
- **PDF.js**: PDF parsing
- **Mammoth.js**: DOCX parsing
- **jsPDF**: PDF generation
- **docx**: DOCX generation
- **html2canvas**: HTML to canvas conversion
- **Lucide React**: Icon library

## Configuration

### Changing the AI Model

Edit `src/services/ollamaService.js`:

```javascript
constructor() {
  this.model = 'llama2' // Change to your preferred model
}
```

Available models:
- llama2
- mistral
- codellama
- llama2:13b
- And more from Ollama library

### Customizing Templates

Templates can be customized in `src/components/TemplateEditor.jsx` and `src/components/TemplateEditor.css`.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Troubleshooting

### Ollama Connection Issues

If you see "Failed to connect to Ollama" error:

1. Make sure Ollama is installed and running:
```bash
ollama serve
```

2. Verify Ollama is accessible:
```bash
curl http://localhost:11434/api/tags
```

3. Check if a model is installed:
```bash
ollama list
```

### File Upload Issues

- Ensure files are under 10MB
- Supported formats: PDF, DOCX, TXT
- Check browser console for detailed error messages

### Export Issues

- For PDF export, ensure the resume preview is fully rendered
- For DOCX export, check that all required fields are filled

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

- Ollama team for the amazing local AI platform
- React team for the excellent framework
- All open-source library contributors

---

Built with ❤️ using React and Ollama