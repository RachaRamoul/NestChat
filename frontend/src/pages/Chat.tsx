import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getUsernameFromToken } from '../utils/getUsernameFromToken';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3000');

export default function Chat() {
  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [text, setText] = useState('');
  const username = getUsernameFromToken() ?? 'Inconnu';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  useEffect(() => {
    const handleMessage = (data: { user: string; message: string }) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit('message', { user: username, message: text });
    setText('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.user}:</strong> {msg.message}</div>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Entrez un message"
      />
      <button onClick={sendMessage}>Envoyer</button>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
