// src/api/chatgpt.ts
import axios from 'axios';

const apiKey = 'YOUR_OPENAI_API_KEY';

export const sendMessageToChatGPT = async (message: string) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    }
  );

  return response.data.choices[0].message.content;
};
