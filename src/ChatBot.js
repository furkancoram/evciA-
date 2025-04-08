// EvciAI - Sesli ve mobil uyumlu yapay zeka destekli sohbet (OpenAI GPT-3.5 ile)
import React, { useState, useRef, useEffect } from 'react';

const EvciAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const recognitionRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const botMessage = await fetchOpenAIResponse(input);
      setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
      speak(botMessage);
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
          { role: "system", content: "Sen EvciAI isimli, ev işleri ve tariflerde yardımcı olan bir asistansın." },
          { role: "user", content: userInput }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    if (!data.choices || !data.choices[0]) throw new Error("Geçerli bir yanıt alınamadı.");
    return data.choices[0].message.content.trim();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Tarayıcınız sesli komutları desteklemiyor.");

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'tr-TR';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      };
    }
    recognitionRef.current.start();
  };

  const themeStyles = {
    backgroundColor: darkMode ? '#1e1e1e' : '#f7f9fc',
    color: darkMode ? '#f7f9fc' : '#1e1e1e'
  };

  const chatBoxStyles = {
    backgroundColor: darkMode ? '#2c2c2c' : '#fff',
    border: darkMode ? '1px solid #444' : '1px solid #ddd',
    boxShadow: darkMode ? '0 0 10px rgba(255,255,255,0.1)' : '0 0 10px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 700,
      margin: 'auto',
      padding: 16,
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ...themeStyles
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>🤖 EvciAI</h2>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          style={{ background: darkMode ? '#f0f0f0' : '#1e1e1e', color: darkMode ? '#000' : '#fff', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer' }}>
          {darkMode ? '☀️ Aydınlık' : '🌙 Karanlık'}
        </button>
      </div>

      <div style={{ borderRadius: 12, padding: 16, flexGrow: 1, overflowY: 'auto', ...chatBoxStyles }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <span style={{
              padding: '10px 14px',
              background: msg.sender === 'user'
                ? darkMode ? '#3d9970' : '#d1e7dd'
                : darkMode ? '#444' : '#f0f0f0',
              borderRadius: 20,
              display: 'inline-block',
              maxWidth: '80%',
              color: darkMode ? '#fff' : '#333'
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'left', color: darkMode ? '#aaa' : '#666', fontStyle: 'italic' }}>Yazıyor...</div>}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Bir şeyler yaz veya konuş..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 20,
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: 16,
            backgroundColor: darkMode ? '#2c2c2c' : '#fff',
            color: darkMode ? '#fff' : '#000'
          }}
        />
        <button onClick={handleSend} style={{ backgroundColor: '#0d6efd', color: '#fff', padding: '10px 18px', border: 'none', borderRadius: 20, cursor: 'pointer' }}>Gönder</button>
        <button onClick={startListening} style={{ backgroundColor: '#198754', color: '#fff', padding: '10px 14px', border: 'none', borderRadius: 20, cursor: 'pointer' }}>🎙</button>
      </div>
    </div>
  );
};

export default EvciAI;
