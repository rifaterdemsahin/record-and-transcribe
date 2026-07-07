# TODO: Record & Transcribe

## ✅ Done
- [x] spec.md — architecture and requirements
- [x] agents.md — AI agent instructions
- [x] README.md — project overview
- [x] server.js — Express server with `/api/transcribe` (OpenAI Whisper)
- [x] index.html — responsive SPA with recorder, copy/download buttons
- [x] Dockerfile + fly.toml — container config
- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`)
- [x] fly.io app created and deployed: **https://record-and-transcribe.fly.dev**
- [x] FLY_API_TOKEN set as GitHub repo secret
- [x] formula_flytoken.md — documented the token setup process
- [x] Pushed to GitHub: `git@github.com:rifaterdemsahin/record-and-transcribe.git`

## ⚠️ Needs Input From User

### 1. OPENAI_API_KEY (required for transcription)
The app deploys and the UI works, but transcription will fail without this key.

**Action needed:**
```bash
fly secrets set OPENAI_API_KEY=sk-... -a record-and-transcribe
fly deploy -a record-and-transcribe
```

### 2. Delivery Pilot Key Vault integration
You mentioned using `az login` and delivery pilot key vault. This could be used to:
- Store `OPENAI_API_KEY` in Azure Key Vault
- Have the app fetch it at startup (adds complexity) OR
- Inject it at deploy time via CI pipeline fetching from Key Vault

**Action needed:** Clarify how you want key vault integrated (see options below).

### 3. Org-level FLY_API_TOKEN
No GitHub organization detected (`gh api user/orgs` returned empty). The token was set at repo level only. If you want org-wide, you'd need an org first.

## 🔜 Optional Improvements
- [ ] Azure Key Vault integration for secrets management
- [ ] Add fly.toml to `.gitignore` if you prefer manual config per environment  
- [ ] Add a `/health` endpoint monitoring check in CI
- [ ] Server-side audio format conversion (better Whisper compatibility)
- [ ] Error handling for unsupported browsers
