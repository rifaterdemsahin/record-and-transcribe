# Spec: Record & Transcribe

## Overview
A web application that records audio from the browser microphone, uploads it to a server, transcribes it using OpenRouter (Whisper), and returns the transcribed text. Deployed on fly.io with GitHub Actions CI/CD.

## Architecture

```
Browser (MediaRecorder API)
    │  POST /api/transcribe  (multipart audio blob)
    ▼
Express Server (Node.js)
    │  multipart/form-data → buffer
    │  POST https://openrouter.ai/api/v1/audio/transcriptions
    ▼
OpenRouter (Whisper)
    │  { text: "..." }
    ▼
Express → JSON response → Browser renders text
```

## Tech Stack
- **Frontend**: Single `index.html` with vanilla JS, CSS, responsive design
- **Backend**: Node.js + Express, `multer` for file uploads, `openai` npm package → OpenRouter
- **Transcription**: OpenRouter (`openai/whisper-1` model)
- **Deployment**: Docker → fly.io
- **CI/CD**: GitHub Actions with `flyctl`

## Features
- Record audio via microphone
- Visual recording timer
- Download audio before or after transcription
- Upload & transcribe via OpenRouter Whisper
- Display transcribed text
- Copy text to clipboard
- Download audio as `.webm`
- Download text as `.txt`
- Responsive design (mobile + desktop)

## Environment Variables
| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key for Whisper transcription |

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Serves `index.html` |
| `POST` | `/api/transcribe` | Accepts `audio` file (multipart), returns `{ text }` |
| `GET` | `/health` | Health check |

## File Structure
```
/
├── index.html          # Frontend (responsive SPA)
├── server.js           # Express server
├── package.json        # Dependencies
├── Dockerfile          # Container build
├── .dockerignore
├── .gitignore
├── .github/workflows/deploy.yml  # CI/CD
├── spec.md             # This file
├── agents.md           # AI agent instructions
└── README.md           # Project docs
```
