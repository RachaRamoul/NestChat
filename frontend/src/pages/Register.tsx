import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Inscription réussie ! Connectez-vous maintenant.');
      navigate('/login');
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}
