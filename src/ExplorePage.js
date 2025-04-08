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
  arrayRemove,
  addDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
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

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text || !user) return;
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      text,
      uid: user.uid,
      username: user.displayName,
      createdAt: new Date()
    });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
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

          <div style={{ marginTop: 10 }}>
            <input
              value={commentInputs[post.id] || ''}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
              placeholder="Yorum yap..."
              style={{ padding: 8, borderRadius: 6, width: '80%' }}
            />
            <button onClick={() => handleCommentSubmit(post.id)} style={{ marginLeft: 8, padding: '6px 12px' }}>Gönder</button>
          </div>
        </div>
      ))}

      {posts.length === 0 && <p>Henüz gönderi yok. Paylaşmaya başla!</p>}
    </div>
  );
};

export default ExplorePage;
