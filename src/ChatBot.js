// Gerçek zamanlı yapay zeka destekli sohbet (OpenAI GPT-3.5 ile)
import React, { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const botMessage = await fetchOpenAIResponse(input);
      setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: `Bir hata oluştu: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpenAIResponse = async (userInput) => {
    // Buraya API anahtarını doğrudan geçici olarak yazabilirsin (Render için .env yerine)
    const apiKey = "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";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sen kullanıcılara ev işleri, yemek tarifleri ve günlük sohbetlerde yardımcı olan nazik, sevecen ve bilgili bir yardımcı botsun." },
          { role: "user", content: userInput }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.choices || !data.choices[0]) {
      throw new Error("Geçerli bir yanıt alınamadı.");
    }

    return data.choices[0].message.content.trim();
  };

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: 'auto', padding: 16 }}>
      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minHeight: 400 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ whiteSpace: 'pre-wrap', padding: 8, background: msg.sender === 'user' ? '#dcf8c6' : '#f1f0f0', borderRadius: 8, display: 'inline-block' }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'left', color: '#999' }}>Yazıyor...</div>}
      </div>
      <div style={{ display: 'flex', marginTop: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          placeholder="Bir mesaj yazın..."
        />
        <button onClick={handleSend} style={{ marginLeft: 8, padding: '8px 16px' }}>Gönder</button>
      </div>
    </div>
  );
};

export default ChatBot;
