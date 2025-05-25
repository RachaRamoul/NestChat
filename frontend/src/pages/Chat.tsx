import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getUsernameFromToken } from '../utils/getUsernameFromToken';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const socket = io('http://localhost:3000');

export default function Chat() {
  const [messages, setMessages] = useState<{ from: string; message: string; color?: string }[]>([]);
  const [text, setText] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [color, setColor] = useState('');

  const username = getUsernameFromToken() ?? 'Inconnu';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    socket.emit('login', username);
  
    socket.on('your-color', (serverColor: string) => {
      setColor(serverColor);
    });
  
    socket.on('users:list', (userList: string[]) => {
      setUsers(userList.filter((name) => name !== username));
    });
  
    socket.on('private-message', (data: { from: string; message: string; color?: string }) => {
      setMessages((prev) => [...prev, data]);
    });
  
    return () => {
      socket.off('your-color');
      socket.off('users:list');
      socket.off('private-message');
    };
  }, [username]);
  

  const openChatWith = (user: string) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    socket.emit('private-message', {
      to: selectedUser,
      message: text,
      color,
    });

    setMessages((prev) => [
      ...prev,
      { from: 'Moi → ' + selectedUser, message: text, color }, 
    ]);
        setText('');
  };


  const updateColor = async () => {
    const token = localStorage.getItem('token');  
    try {
      await api.patch('/users/color', { color });
  
      const meRes = await api.get('/users/me');
      setColor(meRes.data.color);
  
      socket.emit('login', username);
      alert('Couleur mise à jour !');
    } catch (err: any) {
      alert('Erreur lors de la mise à jour de la couleur');
    }
  };
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Bienvenue, {username}</h2>

      <h3>Utilisateurs connectés</h3>
      <ul>
        {users.map((user) => (
          <li key={user}>
            <button onClick={() => openChatWith(user)}>
              Discuter avec {user}
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 0 15px rgba(0,0,0,0.4)',
          }}>
            <h3>Discussion avec {selectedUser}</h3>
            <div style={{
              margin: '1rem 0',
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '0.5rem',
            }}>
              {messages
                .filter(msg => msg.from === selectedUser || msg.from === `Moi → ${selectedUser}`)
                .map((msg, i) => (
                <div key={i} style={{ color: msg.color || '#000' }}>
                  <strong>{msg.from}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écris ton message..."
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <button onClick={sendMessage} style={{ marginRight: '0.5rem' }}>
              Envoyer
            </button>
            <button onClick={() => setIsModalOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Changer la couleur de ton profil</h3>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <button onClick={updateColor}>Mettre à jour</button>
      </div>

      <button onClick={handleLogout} style={{ marginTop: '2rem' }}>Déconnexion</button>

    </div>
  );
}
