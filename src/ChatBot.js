// EvciAI - Firebase Google Login Entegreli Mobil Sohbet Uygulaması
import React, { useState, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "evciai-6ee17.firebaseapp.com",
  projectId: "evciai-6ee17",
  storageBucket: "evciai-6ee17.appspot.com",
  messagingSenderId: "8963614199",
  appId: "1:8963614199:web:3ab1e9cf92afeda3cabaf2",
  measurementId: "G-Q4DLMYBKD0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const EvciAI = () => {
  const [user, setUser] = useState(null);
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
          { role: "system", content: "Sen EvciAI adında, insanlarla doğal konuşmalar yapan bir yapay zeka sohbet asistanısın. Nazik, akıllı ve samimi konuşursun." },
          { role: "user", content: userInput }
        ]
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    if (!data.choices || !data.choices[0]) throw new Error("Geçerli bir yanıt alınamadı.");
    return data.choices[0].message.content.trim();
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

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      alert("Giriş başarısız: " + error.message);
    }
  };

  const themeStyles = {
    backgroundColor: darkMode ? '#1e1e1e' : '#f7f9fc',
    color: darkMode ? '#f7f9fc' : '#1e1e1e',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif'
  };

  if (!user) {
    return (
      <div style={{ ...themeStyles, alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>EvciAI’ye Hoş Geldin 👋</h2>
        <button onClick={loginWithGoogle} style={{ padding: '10px 20px', fontSize: 16, borderRadius: 8, backgroundColor: '#4285F4', color: '#fff', border: 'none' }}>
          Google ile Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div style={themeStyles}>
      <header style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>🤖 EvciAI</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer', color: darkMode ? '#fff' : '#333' }}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main style={{ flexGrow: 1, padding: '12px 16px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: 16,
              backgroundColor: msg.sender === 'user' ? (darkMode ? '#4caf50' : '#d1e7dd') : (darkMode ? '#444' : '#eee'),
              color: darkMode ? '#fff' : '#333',
              maxWidth: '80%'
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ fontStyle: 'italic', color: darkMode ? '#aaa' : '#666' }}>Yazıyor...</div>}
      </main>

      <footer style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #ccc' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Yaz veya konuş..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 16,
            border: '1px solid #ccc',
            fontSize: 16,
            backgroundColor: darkMode ? '#2c2c2c' : '#fff',
            color: darkMode ? '#fff' : '#000'
          }}
        />
        <button onClick={handleSend} style={{ padding: '10px 16px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 'bold' }}>Gönder</button>
        <button onClick={startListening} style={{ padding: '10px 16px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: 16 }}>🎤</button>
      </footer>
    </div>
  );
};

export default EvciAI;
