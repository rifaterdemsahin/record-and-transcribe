# Formula: FLY_API_TOKEN Setup for GitHub Actions

## Overview
This document describes how to generate a fly.io deploy token and add it to GitHub for automated deployments.

## Prerequisites
- `flyctl` CLI installed and authenticated (`flyctl auth login`)
- `gh` CLI installed and authenticated (`gh auth login`)
- fly.io app already created

## Steps

### 1. Create the fly.io app (if not exists)
```bash
flyctl apps create <app-name> --org personal
```

### 2. Generate a deploy token
```bash
fly tokens create deploy -n "github-actions" -a <app-name>
```

Or get JSON with expiry:
```bash
fly tokens create deploy -n "github-actions" -a <app-name> -x 87600h --json
```
Default expiry is 175200h (20 years).

### 3. Set the token in GitHub

**Repo-level secret (recommended):**
```bash
gh secret set FLY_API_TOKEN -b"<token-value>" -r <owner>/<repo>
```

**Org-level secret (all repos in org):**
```bash
gh secret set FLY_API_TOKEN -b"<token-value>" -o <org-name> --visibility all
```

Or via GitHub UI: `Settings > Secrets and variables > Actions > New repository secret`

### 4. Use in GitHub Actions workflow
```yaml
- name: Deploy to fly.io
  env:
    FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
  run: flyctl deploy --remote-only
```

### 5. Verify
Push to the configured branch and check Actions tab for successful deploy.

## Automated Script
```bash
#!/bin/bash
APP_NAME="record-and-transcribe"
REPO="rifaterdemsahin/record-and-transcribe"

# Create app if needed
flyctl apps create "$APP_NAME" --org personal 2>/dev/null

# Generate token
TOKEN=$(fly tokens create deploy -n "github-actions" -a "$APP_NAME" --json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Set GitHub secret
gh secret set FLY_API_TOKEN -b"$TOKEN" -r "$REPO"

echo "FLY_API_TOKEN set for $REPO"
```

## Notes
- Tokens are scoped to a specific app when using `fly tokens create deploy -a <app>`
- For org-wide use, create a token without `-a` flag (full access) and set as org secret
- The `flyctl auth token` command is deprecated; use `fly tokens create` instead
