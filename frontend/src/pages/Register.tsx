import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setStatusMessage("Inscription réussie ! Connectez-vous maintenant.");
      setTimeout(() => {
        setStatusMessage('');
        navigate('/login');
      }, 2000);
    } catch (err) {
      setStatusMessage("Erreur lors de l'inscription.");
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
        <h2 style={{ fontSize: '2rem', color: '#334e68' }}>Inscription</h2>

        {statusMessage && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: statusMessage.includes('réussie') ? '#dcfce7' : '#fee2e2',
            color: statusMessage.includes('réussie') ? '#166534' : '#b91c1c',
            border: '1px solid',
            borderColor: statusMessage.includes('réussie') ? '#86efac' : '#fca5a5',
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
          name="username"
          placeholder="Nom d'utilisateur"
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
          S'inscrire
        </button>

        <p style={{ fontSize: '0.95rem' }}>
          Vous avez déjà un compte ?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#5a7de0', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Connectez-vous
          </span>
        </p>
      </form>
    </div>
  );
}
