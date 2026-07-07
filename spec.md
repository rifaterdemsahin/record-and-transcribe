# Spec: Record & Transcribe

## Overview
A web application that records audio from the browser microphone, uploads it to a server, transcribes it using OpenAI Whisper, and returns the transcribed text. Deployed on fly.io with GitHub Actions CI/CD.

## Architecture

```
Browser (MediaRecorder API)
    │  POST /api/transcribe  (multipart audio blob)
    ▼
Express Server (Node.js)
    │  multipart/form-data → buffer
    │  POST https://api.openai.com/v1/audio/transcriptions
    ▼
OpenAI Whisper API
    │  { text: "..." }
    ▼
Express → JSON response → Browser renders text
```

## Tech Stack
- **Frontend**: Single `index.html` with vanilla JS, CSS, responsive design
- **Backend**: Node.js + Express, `multer` for file uploads, `openai` npm package
- **Transcription**: OpenAI Whisper API (`whisper-1` model)
- **Deployment**: Docker → fly.io
- **CI/CD**: GitHub Actions with `flyctl`

## Features
- Record audio via microphone
- Visual recording timer
- Upload & transcribe via OpenAI Whisper
- Display transcribed text
- Copy text to clipboard
- Download audio as `.webm`
- Download text as `.txt`
- Responsive design (mobile + desktop)

## Environment Variables
| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for Whisper transcription |

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
