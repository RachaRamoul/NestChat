import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      alert('Email ou mot de passe incorrect');
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
          padding: '2.5rem 3rem',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#334e68' }}>Connexion</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
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
            marginBottom: '1.5rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
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
      </form>
    </div>
  );
}
