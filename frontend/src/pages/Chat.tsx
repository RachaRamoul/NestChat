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
  const [unread, setUnread] = useState<Record<string, number>>({});

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
  
      if (!(data.from === selectedUser && isModalOpen)) {
        setUnread((prev) => ({
          ...prev,
          [data.from]: (prev[data.from] || 0) + 1,
        }));
      }
    });
  
    return () => {
      socket.off('your-color');
      socket.off('users:list');
      socket.off('private-message');
    };
  }, [username, selectedUser, isModalOpen]);

  useEffect(() => {
    if (selectedUser && isModalOpen) {
      setUnread((prev) => {
        const updated = { ...prev };
        delete updated[selectedUser];
        return updated;
      });
    }
  }, [selectedUser, isModalOpen, messages]);
  

  const openChatWith = (user: string) => {
    setUnread((prev) => {
      const updated = { ...prev };
      delete updated[user]; 
      return updated;
    });
  
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
    try {
      await api.patch('/users/color', { color });
      const meRes = await api.get('/users/me');
      setColor(meRes.data.color);
      socket.emit('login', username);
      alert('Couleur mise à jour !');
    } catch {
      alert('Erreur lors de la mise à jour de la couleur');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #dce6f9, #efe3ff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          padding: '2.5rem 3rem',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
          Bienvenue, <span style={{ color }}>{username}</span>
        </h2>
  
        {/* Couleur */}
        <div style={{ marginTop: '0.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: '#334e68' }}>
            Changer la couleur de ton profil
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                height: '40px',
                width: '60px',
                border: '2px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            />
            <button
              onClick={updateColor}
              style={{
                background: '#5a7de0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.2rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#7b9dfc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#5a7de0')}
            >
              Mettre à jour
            </button>
          </div>
        </div>
  
        {/* Utilisateurs connectés */}
        <h3 style={{ marginTop: '2rem', fontSize: '1.2rem', color: '#334e68' }}>
          Utilisateurs connectés
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
        {users.map((user) => (
          <li key={user} style={{ marginBottom: '0.5rem', position: 'relative' }}>
            <button
              onClick={() => openChatWith(user)}
              style={{
                position: 'relative',
                background: '#5a7de0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#7b9dfc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#5a7de0')}
            >
              Discuter avec {user}
              {unread[user] > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    background: 'red',
                    color: 'white',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {unread[user]}
                </span>
              )}
            </button>
          </li>
        ))}
        </ul>
  
        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: '2rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f87171')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#dc2626')}
        >
          Déconnexion
        </button>
      </div>
  
      {/* Modale */}
      {isModalOpen && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            fontFamily: 'Segoe UI, sans-serif',
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#334e68' }}>
              Discussion avec <span style={{ fontWeight: 600 }}>{selectedUser}</span>
            </h3>
  
            <div style={{
              marginBottom: '1rem',
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '0.75rem',
              borderRadius: '8px',
            }}>
              {messages
                .filter(msg => msg.from === selectedUser || msg.from === `Moi → ${selectedUser}`)
                .map((msg, i) => (
                  <div key={i} style={{ color: msg.color || '#000', marginBottom: '0.5rem' }}>
                    <strong>{msg.from}:</strong> {msg.message}
                  </div>
              ))}
            </div>
  
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écris ton message..."
              rows={3}
              style={{
                width: '100%',
                marginBottom: '1rem',
                padding: '0.6rem',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '1rem',
                resize: 'none',
              }}
            />
  
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={sendMessage}
                style={{
                  background: '#5a7de0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#7b9dfc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#5a7de0')}
              >
                Envoyer
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#e0e0e0')}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
}
