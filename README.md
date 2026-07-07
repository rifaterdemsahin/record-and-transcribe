# Record & Transcribe

Record audio from your browser and transcribe it using OpenAI Whisper.

## Live Demo

**[record-and-transcribe.fly.dev](https://record-and-transcribe.fly.dev)**

## Features

- Record audio from your microphone
- Transcribe with OpenAI Whisper
- Copy transcribed text to clipboard
- Download audio as `.webm`
- Download transcription as `.txt`
- Responsive design (mobile + desktop)

## Quick Start

```bash
npm install
OPENAI_API_KEY=sk-... npm start
```

Open http://localhost:3000

## Deploy

```bash
fly launch
fly secrets set OPENAI_API_KEY=sk-...
fly deploy
```

## CI/CD

Push to `main` branch triggers automatic deployment via GitHub Actions to fly.io.

See [formula_flytoken.md](formula_flytoken.md) for the FLY_API_TOKEN setup process.

## Docs

- [spec.md](spec.md) — Architecture & requirements
- [agents.md](agents.md) — AI agent instructions
- [todo.md](todo.md) — Status & pending items
- [formula_flytoken.md](formula_flytoken.md) — fly.io token setup for CI/CD
