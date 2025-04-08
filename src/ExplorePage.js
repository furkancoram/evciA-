// ExplorePage.js – Gündemdeki içerikleri gösterir (Keşfet sekmesi)
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const db = getFirestore();

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📈 Gündemdekiler</h2>

      {posts.map(post => (
        <div key={post.id} style={{ background: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={post.photo} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <strong>{post.username}</strong>
          </div>
          <p style={{ marginTop: 8 }}>{post.text}</p>
        </div>
      ))}

      {posts.length === 0 && <p>Henüz gönderi yok. Paylaşmaya başla!</p>}
    </div>
  );
};

export default ExplorePage;
