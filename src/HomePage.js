import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const HomePage = () => {
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !text.trim()) return;
    await addDoc(collection(db, 'posts'), {
      text,
      username: user.displayName,
      uid: user.uid,
      photo: user.photoURL,
      createdAt: new Date()
    });
    setText('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📝 Gönderi Paylaş</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ne düşünüyorsun?"
        rows={3}
        style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8 }}
      />
      <button onClick={handleSubmit} style={{ marginTop: 8, padding: '10px 16px', borderRadius: 8, backgroundColor: '#0d6efd', color: '#fff', border: 'none' }}>
        Gönder
      </button>

      <hr style={{ margin: '24px 0' }} />
      <h3>Gönderiler</h3>

      {posts.map(post => (
        <div key={post.id} style={{ background: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={post.photo} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <strong>{post.username}</strong>
          </div>
          <p style={{ marginTop: 8 }}>{post.text}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
