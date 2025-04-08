// ExplorePage.js – Gündemdeki içerikleri gösterir (Keşfet sekmesi)
import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const toggleAction = async (postId, field) => {
    const ref = doc(db, 'posts', postId);
    if (!user) return;
    const uid = user.uid;
    await updateDoc(ref, {
      [field]: arrayUnion(uid)
    });
  };

  const toggleRemove = async (postId, field) => {
    const ref = doc(db, 'posts', postId);
    if (!user) return;
    const uid = user.uid;
    await updateDoc(ref, {
      [field]: arrayRemove(uid)
    });
  };

  const handleToggle = async (post, field) => {
    if (!user) return;
    const hasActioned = post[field]?.includes(user.uid);
    if (hasActioned) {
      await toggleRemove(post.id, field);
    } else {
      await toggleAction(post.id, field);
    }
  };

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

          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <button onClick={() => handleToggle(post, 'likes')}>❤️ {post.likes?.length || 0}</button>
            <button onClick={() => handleToggle(post, 'retweets')}>🔁 {post.retweets?.length || 0}</button>
            <button onClick={() => handleToggle(post, 'saved')}>📌 {post.saved?.length || 0}</button>
          </div>
        </div>
      ))}

      {posts.length === 0 && <p>Henüz gönderi yok. Paylaşmaya başla!</p>}
    </div>
  );
};

export default ExplorePage;
