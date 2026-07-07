const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OpenAI = require('openai');
const { toFile } = require('openai/uploads');
const { execFile } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://record-and-transcribe.fly.dev',
    'X-Title': 'Record & Transcribe',
  },
});

const CREDITS_LINK = 'https://openrouter.ai/settings/credits';
const COST_COMPARE = 'https://github.com/rifaterdemsahin/record-and-transcribe/blob/main/cost-comparison.md';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/debug', (req, res) => {
  res.json({
    provider: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'openai/whisper-1',
    fallback: 'google/gemini-2.0-flash-001',
    keyPresent: !!process.env.OPENROUTER_API_KEY,
    keyPrefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 12) + '...' : 'not set',
    costComparison: COST_COMPARE,
    creditsLink: CREDITS_LINK,
  });
});

async function transcribeWithWhisper(buffer, name, mime) {
  const file = await toFile(buffer, name, { type: mime });
  const result = await openai.audio.transcriptions.create({
    model: 'openai/whisper-1',
    file,
  });
  return { text: result.text, model: 'openai/whisper-1' };
}

async function transcribeWithGemini(buffer, mime) {
  const base64 = buffer.toString('base64');
  const format = mime.includes('webm') ? 'webm' : mime.includes('mp4') ? 'mp4' : 'wav';

  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Transcribe the following audio to text. Return only the transcription, no other text.' },
          {
            type: 'input_audio',
            input_audio: {
              data: base64,
              format: format,
            },
          },
        ],
      },
    ],
  });

  return { text: completion.choices[0].message.content, model: 'google/gemini-2.0-flash-001' };
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Transcribing file:', req.file.originalname, 'size:', req.file.size, 'type:', req.file.mimetype);

    try {
      const result = await transcribeWithWhisper(req.file.buffer, req.file.originalname, req.file.mimetype);
      console.log('Whisper success:', result.text.substring(0, 80));
      res.json({ text: result.text, model: result.model });
    } catch (whisperErr) {
      const isBalanceError =
        whisperErr.status === 402 ||
        (whisperErr.message && whisperErr.message.toLowerCase().includes('balance'));

      if (isBalanceError) {
        console.log('Whisper failed (402 balance), falling back to Gemini...');
        try {
          const result = await transcribeWithGemini(req.file.buffer, req.file.mimetype);
          console.log('Gemini success:', result.text.substring(0, 80));
          res.json({ text: result.text, model: result.model, fallback: true });
        } catch (geminiErr) {
          console.error('Gemini fallback error:', geminiErr.message);
          res.status(500).json({
            error: 'Whisper requires credits (402). Gemini fallback also failed: ' + geminiErr.message,
            creditsLink: CREDITS_LINK,
            costComparison: COST_COMPARE,
          });
        }
      } else {
        throw whisperErr;
      }
    }
  } catch (err) {
    console.error('Transcription error:', err.message, err.status);
    const msg = err.status === 402
      ? 'OpenRouter Whisper requires $0.50+ balance. ' + CREDITS_LINK
      : (err.message || 'Transcription failed');
    res.status(500).json({ error: msg, creditsLink: err.status === 402 ? CREDITS_LINK : null, costComparison: err.status === 402 ? COST_COMPARE : null });
  }
});

app.post('/api/convert-to-mp3', upload.single('audio'), async (req, res) => {
  const tmpDir = os.tmpdir();
  const inputFile = path.join(tmpDir, 'input-' + Date.now() + '.webm');
  const outputFile = path.join(tmpDir, 'output-' + Date.now() + '.mp3');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    fs.writeFileSync(inputFile, req.file.buffer);

    await new Promise((resolve, reject) => {
      execFile('ffmpeg', [
        '-y', '-i', inputFile,
        '-codec:a', 'libmp3lame',
        '-qscale:a', '2',
        outputFile,
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const mp3Buffer = fs.readFileSync(outputFile);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="recording.mp3"',
      'Content-Length': mp3Buffer.length,
    });
    res.send(mp3Buffer);
  } catch (err) {
    console.error('MP3 conversion error:', err.message);
    res.status(500).json({ error: 'MP3 conversion failed: ' + err.message });
  } finally {
    try { fs.unlinkSync(inputFile); } catch (e) {}
    try { fs.unlinkSync(outputFile); } catch (e) {}
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
