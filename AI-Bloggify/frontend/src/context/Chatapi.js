const API_URL = `${import.meta.env.VITE_BASE_URL}/api/chat`;

export const getSessionId = () => {
  let id = localStorage.getItem('blogbot_session');
  if (!id) {
    id = 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('blogbot_session', id);
  }
  return id;
};

export const sendMessage = async (message) => {
  const sessionId = getSessionId();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId })
  });
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  return data.reply;
};

export const clearSession = async () => {
  const sessionId = getSessionId();
  await fetch(`${API_URL}/clear/${sessionId}`, { method: 'DELETE' });
  localStorage.removeItem('blogbot_session');
};