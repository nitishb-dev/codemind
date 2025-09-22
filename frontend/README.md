# CodeMind Lite - Frontend

A modern React frontend for the CodeMind Lite AI repository analysis tool. Built with React, TypeScript, Tailwind CSS, and Vite for fast development and optimal performance.

## ✨ Features

- **Repository Upload**: Drag-and-drop interface for Python repository ZIP files
- **AI Chat Interface**: Natural language queries about your code
- **Real-time Communication**: Seamless integration with FastAPI backend
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Clean, professional interface with smooth animations
- **Environment Configuration**: Easy backend URL configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A running CodeMind Lite backend (see backend README)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend URL:
   ```env
   VITE_API_URL=http://localhost:10000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Set environment variables in Vercel:**
   - Go to your Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add `VITE_API_URL` with your backend URL (e.g., `https://your-app.onrender.com`)

### Alternative: Deploy via Vercel Dashboard

1. Connect your GitHub repository to Vercel
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Add environment variable `VITE_API_URL`
5. Deploy!

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ChatBox.tsx     # Chat interface component
│   ├── FileUpload.tsx  # File upload component
│   └── Navbar.tsx      # Navigation component
├── pages/              # Page components
│   ├── UploadPage.tsx  # Upload interface page
│   └── ChatPage.tsx    # Chat interface page
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── App.tsx            # Main app component
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **Lucide React** - Beautiful icons
- **React Dropzone** - File upload functionality
- **Axios** - HTTP client

## 🎨 Features Overview

### Upload Interface
- Drag-and-drop file upload
- File validation (ZIP files, max 50MB)
- Real-time upload progress
- Error handling and user feedback

### Chat Interface  
- Real-time messaging with AI
- Syntax highlighting for code responses
- Message history persistence
- Typing indicators and loading states

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Consistent spacing using 8px grid system
- Modern card-based layouts

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:10000` |

### Backend Requirements

The frontend expects the following backend endpoints:

- `POST /upload` - Upload repository ZIP file
- `POST /generate_docs` - Generate documentation
- `POST /chat` - Chat with repository
- `GET /health` - Health check

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

- ESLint configuration for code quality
- TypeScript strict mode enabled
- Consistent component organization
- Custom hooks for API logic
- Proper separation of concerns

## 📦 Build and Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

### Backend Integration

Ensure your backend is deployed and accessible. Common backend deployment options:
- **Render**: Free tier available, good for FastAPI
- **Railway**: Modern platform with good Python support  
- **Heroku**: Classic choice (paid plans only)

Update your `VITE_API_URL` to point to your deployed backend.

## 🚨 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if backend is running
   - Verify `VITE_API_URL` is correct
   - Check CORS settings on backend

2. **Upload Fails**
   - Ensure file is a valid ZIP
   - Check file size (max 50MB)
   - Verify backend `/upload` endpoint

3. **Build Issues**
   - Clear `node_modules` and reinstall
   - Check Node.js version (18+)
   - Verify all environment variables are set

### Health Check

The app includes a backend health check that runs automatically. If the backend is offline, you'll see a warning banner.

## 📄 License

This project is part of CodeMind Lite - an educational tool for learning AI-powered code analysis.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Next Steps**: Set up the FastAPI backend following the backend README, then deploy both components to their respective platforms.