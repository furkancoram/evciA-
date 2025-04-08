// SohbetEkrani.js - EvciAI sohbet bileşeni
import React, { useState, useRef } from 'react';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
 apiKey: "AIzaSyA-y75uUn5dTPoTzSGar1NHRK9YaEZMDfU",
  authDomain: "evciailo.firebaseapp.com",
  projectId: "evciailo",
  storageBucket: "evciailo.firebasestorage.app",
  messagingSenderId: "263152357253",
  appId: "1:263152357253:web:474c43a65342c3d3157eec",
  measurementId: "G-MZLH10EM9V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const SohbetEkrani = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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

  const logout = () => {
    signOut(auth).then(() => setUser(null));
  };

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>EvciAI’ye Hoş Geldin 👋</h2>
        <button onClick={loginWithGoogle} style={{ padding: '10px 20px', fontSize: 16, borderRadius: 8, backgroundColor: '#4285F4', color: '#fff', border: 'none' }}>
          Google ile Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🤖 EvciAI</h2>
        <button onClick={logout} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: 6 }}>Çıkış Yap</button>
      </header>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: 16,
              backgroundColor: msg.sender === 'user' ? '#d1e7dd' : '#eee',
              color: '#333',
              maxWidth: '80%'
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ fontStyle: 'italic', color: '#666' }}>Yazıyor...</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
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
            fontSize: 16
          }}
        />
        <button onClick={handleSend} style={{ padding: '10px 16px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: 16 }}>Gönder</button>
        <button onClick={startListening} style={{ padding: '10px 16px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: 16 }}>🎤</button>
      </div>
    </div>
  );
};

export default SohbetEkrani;
