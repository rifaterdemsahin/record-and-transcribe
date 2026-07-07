# Agents.md

## Project: Record & Transcribe

### What This Project Does
Records audio from the browser and transcribes it using OpenAI Whisper.

### Development Commands
```bash
npm install          # Install dependencies
npm start            # Start server on port 3000
npm run dev          # Start with auto-reload (nodemon)
```

### Key Files
- `server.js` — Express server, handles transcription API
- `index.html` — Frontend SPA with recorder UI
- `.github/workflows/deploy.yml` — Deploys to fly.io on push to main

### Secrets
- `OPENAI_API_KEY` — set on fly.io via `fly secrets set OPENAI_API_KEY=...`
- `FLY_API_TOKEN` — set in GitHub repo secrets for Actions deployment

### Deployment
- Platform: fly.io
- Region: auto
- App name: record-and-transcribe
- GitHub Actions triggers on push to main branch

### Testing Locally
```bash
OPENAI_API_KEY=sk-... npm start
# Open http://localhost:3000
```

### Code Conventions
- Vanilla JS only (no frameworks)
- Responsive CSS using flexbox/media queries
- No TypeScript, plain Node.js CommonJS
