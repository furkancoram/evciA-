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
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

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
    <div style={{
      width: '100%',
      maxWidth: 700,
      margin: 'auto',
      padding: 20,
      backgroundColor: '#f7f9fc',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: 12,
        padding: 20,
        flexGrow: 1,
        overflowY: 'auto',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '10px 0'
            }}>
            <span
              style={{
                padding: '10px 14px',
                background: msg.sender === 'user' ? '#d1e7dd' : '#f0f0f0',
                borderRadius: 20,
                display: 'inline-block',
                maxWidth: '80%',
                color: '#333'
              }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'left', color: '#666', fontStyle: 'italic' }}>Yazıyor...</div>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Bir şeyler yaz..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 20,
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: 16
          }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: '#0d6efd',
            color: '#fff',
            padding: '10px 18px',
            border: 'none',
            borderRadius: 20,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
          Gönder
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
