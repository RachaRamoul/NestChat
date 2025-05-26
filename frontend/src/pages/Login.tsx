import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      navigate('/chat');
    } catch (err) {
      setStatusMessage('Email ou mot de passe incorrect');
      setTimeout(() => setStatusMessage(''), 3000);
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
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#ffffff',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#334e68' }}>Connexion</h2>

        {statusMessage && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            fontWeight: 500,
            fontSize: '0.95rem',
            width: '100%',
          }}>
            {statusMessage}
          </div>
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            background: '#5a7de0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#7b9dfc')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#5a7de0')}
        >
          Se connecter
        </button>

        <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Pas encore de compte ?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#5a7de0', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Inscrivez-vous
          </span>
        </p>
      </form>
    </div>
  );
}
