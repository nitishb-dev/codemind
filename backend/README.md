# CodeMind Lite - Backend

FastAPI backend for the CodeMind Lite AI repository analysis tool. Provides endpoints for repository upload, AI-powered documentation generation, and intelligent code chat.

## ✨ Features

- **Repository Upload**: Process Python repository ZIP files
- **AI Documentation**: Generate comprehensive documentation using AI
- **Intelligent Chat**: Natural language queries about uploaded code
- **Code Analysis**: Extract and analyze Python files
- **Health Monitoring**: Health check endpoint for deployment
- **CORS Support**: Cross-origin requests for frontend integration

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip or poetry
- OpenAI API key (optional, for advanced AI features)

### Installation

1. **Clone and install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your configuration:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   HOST=0.0.0.0
   PORT=10000
   DEBUG=False
   ```

3. **Start development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 10000
   ```

   API will be available at [http://localhost:10000](http://localhost:10000)

## 🌐 Deployment

### Deploy to Render

1. **Create a new repository** on GitHub with the backend code
2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
3. **Configure deployment**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
4. **Set environment variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key (optional)
5. **Deploy**: Click "Create Web Service"

### Alternative: Manual Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your_api_key_here"

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 10000
```

## 📁 Project Structure

```
app/
├── main.py              # FastAPI application entry point
├── routes/              # API route handlers
│   ├── upload.py        # Repository upload endpoint
│   ├── docs.py          # Documentation generation
│   ├── chat.py          # Chat with repository
│   └── health.py        # Health check endpoint
├── services/            # Business logic services
│   ├── ai_service.py    # AI response generation
│   ├── embeddings.py    # Code embedding and search
│   └── utils.py         # Utility functions
└── models/              # Pydantic data models
    └── schemas.py       # Request/response schemas
```

## 🛠️ API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check for deployment |
| `POST` | `/upload` | Upload Python repository ZIP |
| `POST` | `/generate_docs` | Generate AI documentation |
| `POST` | `/chat` | Chat with uploaded repository |

### Upload Repository

```bash
curl -X POST http://localhost:10000/upload \
  -F "file=@sample_repo.zip"
```

Response:
```json
{
  "id": "repo_1",
  "name": "sample_repo",
  "uploaded_at": "2024-01-01T00:00:00Z",
  "file_count": 5
}
```

### Chat with Repository

```bash
curl -X POST http://localhost:10000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "repo_id": "repo_1",
    "message": "What does main.py do?"
  }'
```

Response:
```json
{
  "message": "I found main.py in your repository. It contains 150 words of code. This appears to be the main entry point of your application.",
  "relevant_files": ["main.py", "utils.py", "config.py"]
}
```

## 🧠 AI Integration

### Current Implementation

The backend includes a basic AI service that provides:
- Simple keyword-based responses
- File structure analysis
- Function counting and detection
- Dependency identification

### OpenAI Integration (Optional)

To enable advanced AI features:

1. **Set OpenAI API key** in environment variables
2. **Implement OpenAI service** in `ai_service.py`:

```python
import openai

async def generate_openai_response(context: str, question: str) -> str:
    client = openai.Client(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant analyzing Python code."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
        ],
        max_tokens=1000
    )
    
    return response.choices[0].message.content
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for advanced AI features | None |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `10000` |
| `DEBUG` | Debug mode | `False` |
| `MAX_UPLOAD_SIZE` | Maximum upload size in bytes | `52428800` (50MB) |

### File Upload Limits

- **Maximum file size**: 50MB
- **Supported formats**: ZIP files only
- **File types processed**: Python (.py) files
- **Storage**: Temporary filesystem storage

## 🧪 Development

### Available Scripts

```bash
# Start development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 10000

# Run with specific environment
uvicorn app.main:app --env-file .env

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 10000 --workers 4
```

### Testing

```bash
# Test health endpoint
curl http://localhost:10000/health

# Test with sample repository
curl -X POST http://localhost:10000/upload \
  -F "file=@test_repo.zip"
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 10000
   lsof -ti:10000 | xargs kill -9
   ```

2. **Module import errors**
   ```bash
   # Ensure you're in the correct directory
   cd backend
   python -m app.main
   ```

3. **File upload fails**
   - Check file size (max 50MB)
   - Ensure file is a valid ZIP
   - Verify ZIP contains Python files

4. **CORS errors**
   - Check CORS middleware configuration
   - Verify frontend URL is allowed

## 📦 Production Considerations

### Security
- [ ] Add authentication and authorization
- [ ] Implement rate limiting
- [ ] Validate file contents thoroughly
- [ ] Use secure file storage (not /tmp)

### Performance
- [ ] Add database for repository storage
- [ ] Implement caching for AI responses
- [ ] Use background tasks for processing
- [ ] Add request/response compression

### Monitoring
- [ ] Add structured logging
- [ ] Implement health checks
- [ ] Add metrics collection
- [ ] Set up error tracking

## 📄 License

This project is part of CodeMind Lite - an educational tool for learning AI-powered code analysis.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

**Next Steps**: Deploy the backend to Render and update the frontend's `VITE_API_URL` to point to your deployed backend.