# Record & Transcribe

Record audio from your browser and transcribe it using OpenRouter (Whisper).

## Live Demo

**[record-and-transcribe.fly.dev](https://record-and-transcribe.fly.dev)**

> https://rifaterdemsahin.github.io/record-and-transcribe/

## Features

- Record audio from your microphone
- Transcribe with OpenRouter Whisper
- Copy transcribed text to clipboard
- Download audio as `.webm`
- Download transcription as `.txt`
- Responsive design (mobile + desktop)

## Quick Start

```bash
npm install
OPENROUTER_API_KEY=sk-or-v1-... npm start
```

Open http://localhost:3000

## Deploy

```bash
fly launch
fly secrets set OPENROUTER_API_KEY=sk-or-v1-...
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
