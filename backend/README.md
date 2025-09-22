# CodeMind Lite - Backend

FastAPI backend for the CodeMind Lite AI repository analysis tool. Provides endpoints for repository upload, documentation generation, and intelligent code chat powered by the Google Gemini API.

## ✨ Features

- **Repository Upload**: Process Python repository ZIP files
- **AI Documentation**: Generate comprehensive documentation
- **Intelligent Chat**: Natural language queries about uploaded code
- **Code Analysis**: Extract and analyze Python files
- **Health Monitoring**: Health check endpoint for deployment
- **CORS Support**: Cross-origin requests for frontend integration

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip or poetry
- OpenRouter API key (optional, for AI features)

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
   GEMINI_API_KEY=your_gemini_api_key_here
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
   - `OPENROUTER_API_KEY`: Your OpenRouter API key (optional)
5. **Deploy**: Click "Create Web Service"

### Alternative: Manual Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENROUTER_API_KEY="your_api_key_here"

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

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| `GET`  | `/health`        | Health check for deployment   |
| `POST` | `/upload`        | Upload Python repository ZIP  |
| `POST` | `/generate_docs` | Generate AI documentation     |
| `POST` | `/chat`          | Chat with uploaded repository |

### Upload Repository

```bash
curl -X POST http://localhost:10000/upload \
  -F "file=@sample_repo.zip"
```

Response:

```json
{
  "id": "c2f9e5c5-6c1a-4b8a-8f3b-2d3e4c5a6b7d",
  "name": "sample_repo",
  "uploaded_at": "2024-07-23T10:30:00.123Z",
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
  "message": "The main.py file appears to be the primary entry point for a FastAPI application..."
}
```

## 🧠 Google Gemini Integration

### Current Implementation

The backend uses the Google Gemini API to provide:

- **Semantic Search**: Code chunks are converted to vector embeddings using `models/embedding-001` to find the most relevant context for a user's question.
- **AI-Powered Chat**: The `gemini-1.5-flash` model is used to generate intelligent answers based on the retrieved code context.

### Enabling AI Features

To enable the AI-powered features, you must provide a Google Gemini API key.

1.  **Get an API key** from Google AI Studio.
2.  **Set the `GEMINI_API_KEY`** in your `.env` file.

The services in `ai_service.py` and `embeddings.py` are already configured to use this key.

```python
# Example of how the AI service works (from ai_service.py)
import google.generativeai as genai

async def generate_gemini_response(context: str, question: str) -> str:
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"
    response = await model.generate_content_async(prompt)
    return response.text
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description                           | Default   |
| ---------------- | ------------------------------------- | --------- |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | None      |
| `HOST`           | Server host                           | `0.0.0.0` |
| `PORT`           | Server port                           | `10000`   |
| `DEBUG`          | Debug mode                            | `False`   |

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

1.  **`429 ResourceExhausted` (Quota Exceeded) Error**

    When using the chat feature, you might encounter a `429 ResourceExhausted` error from the Google Gemini API. This means you have exceeded the free tier's rate limits for embedding requests.

    - **Recommended Solution**: The most reliable fix is to enable billing on your Google Cloud project. This will grant you significantly higher usage limits.
    - **Workaround**: The application attempts to mitigate this by batching requests with delays, but the daily free-tier limit can still be reached with large repositories.

2.  **Port already in use**

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
