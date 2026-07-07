const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype }),
    });

    res.json({ text: transcription.text });
  } catch (err) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
