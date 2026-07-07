const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OpenAI = require('openai');
const { toFile } = require('openai/uploads');
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/debug', (req, res) => {
  res.json({
    provider: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'openai/whisper-1',
    keyPresent: !!process.env.OPENROUTER_API_KEY,
    keyPrefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 12) + '...' : 'not set',
  });
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Transcribing file:', req.file.originalname, 'size:', req.file.size, 'type:', req.file.mimetype);

    const file = await toFile(req.file.buffer, req.file.originalname, { type: req.file.mimetype });

    const transcription = await openai.audio.transcriptions.create({
      model: 'openai/whisper-1',
      file,
    });

    console.log('Transcription success:', transcription.text.substring(0, 80));
    res.json({ text: transcription.text });
  } catch (err) {
    console.error('Transcription error:', err.message, err.status, err.headers);
    res.status(500).json({ error: err.message || 'Transcription failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
