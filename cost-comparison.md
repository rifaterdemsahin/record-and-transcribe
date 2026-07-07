# Cost Comparison: OpenRouter vs fly.io Local Whisper

## OpenRouter Whisper API

### Pricing
| Metric | Cost |
|--------|------|
| **Per second** | $0.0001 |
| **Per minute** | $0.006 |
| **Per hour** | $0.36 |
| **Minimum balance** | $0.50 (must maintain to use audio APIs) |

### Monthly Projections
| Usage (hours/month) | Monthly Cost |
|----------------------|-------------|
| 1 hour | $0.36 |
| 5 hours | $1.80 |
| 10 hours | $3.60 |
| 16 hours (break-even) | $5.76 |
| 50 hours | $18.00 |
| 100 hours | $36.00 |

### Notes
- All audio operations via OpenRouter require $0.50 minimum balance
- Model: `openai/whisper-1` (1400+ language model)
- First $0.50 gets you ~83 minutes
- Pay-as-you-go, only pay for what you use
- $0 for months with zero usage

---

## fly.io Local Whisper (whisper.cpp tiny model)

### Infrastructure Required
| Resource | Spec | 
|----------|------|
| VM size | shared-cpu-1x |
| Memory | 1024 MB (1 GB) |
| Model | whisper.cpp tiny.en (~75 MB disk) |
| Docker image | ~200 MB (includes model) |

### Pricing
| Metric | Cost |
|--------|------|
| **Monthly flat rate** | **$5.70/month** (shared-cpu-1x @ 1GB) |
| Per second | $0.0000022 |
| Per hour | $0.008 |
| Setup cost | $0 (build time only) |

### Monthly Projections
| Usage (hours/month) | Monthly Cost | Effective $/min |
|----------------------|-------------|-----------------|
| 1 hour | $5.70 | $0.095/min 😬 |
| 10 hours | $5.70 | $0.0095/min |
| 16 hours (break-even) | $5.70 | $0.0059/min ✅ |
| 50 hours | $5.70 | $0.0019/min |
| 100 hours | $5.70 | $0.00095/min |
| Unlimited | $5.70 | → $0.00/min |

---

## Break-Even Analysis

```
          OpenRouter is cheaper          │  fly.io is cheaper
          ←——————————————————————————————│————————————————————————————————→
          $0/mo    $1.80    $3.60   $5.76│  $5.70/mo  (flat)
                                         │
                          16 hrs/mo ─────┘  ← break-even point
```

- **Under 16 hours/month** → OpenRouter is cheaper (pay only for usage)
- **Over 16 hours/month** → fly.io local whisper is cheaper (flat rate)
- **Zero usage months** → OpenRouter is always $0; fly.io still charges $5.70

---

## Recommendation

| Scenario | Best Option |
|----------|-------------|
| Casual / occasional use (< 1 hr/day) | OpenRouter |
| Heavy use (> 1 hr/day) | fly.io local |
| Zero-balance accounts | fly.io local (no $0.50 minimum) |
| Best accuracy (large model) | OpenRouter (whisper-large) |
| Privacy-sensitive data | fly.io local (never leaves your VM) |

### Current situation
OpenRouter balance is < $0.50 → audio APIs are blocked. The only working path right now is **fly.io local**. Once balance is topped up, OpenRouter is cheaper for casual use.

---

## Implementation Options

### Option A: OpenRouter only
- No Docker changes needed
- Requires $0.50+ balance
- 256 MB VM ($2.90/mo) + $0.006/min usage

### Option B: Local whisper primary + OpenRouter fallback  
- Needs 1 GB VM ($5.70/mo)
- whisper.cpp tiny model (~75 MB download at build time)
- Always works, no minimum balance required
- Falls back to OpenRouter Whisper for better accuracy

### Option C: Hybrid
- 256 MB VM ($2.90/mo) for web server
- OpenRouter for transcription
- Add credits when needed

**Current config:** Option C (256 MB, OpenRouter). Blocked by $0.50 minimum.

**Upgrade to:** Option B requires `fly.toml` memory change: `256mb → 1024mb`.
