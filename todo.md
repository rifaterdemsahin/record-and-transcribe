# TODO: Record & Transcribe

## ✅ Done
- [x] spec.md — architecture and requirements
- [x] agents.md — AI agent instructions
- [x] README.md — project overview
- [x] server.js — Express server with `/api/transcribe` via OpenRouter
- [x] index.html — responsive SPA, record → download audio → transcribe on demand
- [x] Dockerfile + fly.toml — container config
- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`)
- [x] fly.io app created and deployed: **https://record-and-transcribe.fly.dev**
- [x] FLY_API_TOKEN set as GitHub repo secret
- [x] formula_flytoken.md — documented the token setup process
- [x] OPENROUTER_API_KEY pulled from Azure Key Vault (`dp-kv-deliverypilot`) and set as fly.io secret
- [x] Pushed to GitHub: `git@github.com:rifaterdemsahin/record-and-transcribe.git`

## 🔄 UX Flow
1. Press record → recording starts with timer
2. Press stop → "Download Audio" + "Transcribe" buttons appear  
3. Click "Download Audio" → saves `.webm` file (no transcription needed)
4. Click "Transcribe" → sends to OpenRouter Whisper → shows Copy + Download .txt + Download Audio

## 🔜 Optional Improvements
- [ ] Add fly.toml to `.gitignore` if you prefer manual config per environment
- [ ] Add a `/health` endpoint monitoring check in CI
- [ ] Server-side audio format conversion (better Whisper compatibility)
- [ ] Add re-record button after completing one cycle
