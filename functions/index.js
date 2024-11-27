// pages/api/roast.js

import OpenAI from 'openai';

const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextjsApp = next({ dev, dir: '.' }); 


// Create a new OpenAI client instance
const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // Ensure this is set in your environment
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    // Validate the prompt
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      const params = {
        messages: [{ role: 'user', content: `Write a funny roast: ${prompt}` }],
        model: 'gpt-3.5-turbo', // Adjust the model as needed
        max_tokens: 100,
      };

      // Create the chat completion
      const chatCompletion = await client.chat.completions.create(params);

      // Send the response back
      res.status(200).json({
        roast: chatCompletion.choices[0].message.content.trim(),
      });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: `Failed to generate roast: ${error.message}` });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}