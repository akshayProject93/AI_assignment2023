const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to handle user queries
app.post('/query', upload.single('pdf'), async (req, res) => {
  try {
    const userQuery = req.body.query;
    const pdfData = req.file ? req.file.buffer.toString('base64') : null;

    // Call OpenAI for response based on user query
    const response = await getOpenAIResponse(userQuery, pdfData);

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to get response from OpenAI
async function getOpenAIResponse(query, pdfData) {
  const openaiApiKey = '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';
  const prompt = `User: ${query}\nChatGPT:`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'text-davinci-003',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
      max_tokens: 150,
      stop: '\n',
      temperature: 0.7,
      prompt: prompt,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});