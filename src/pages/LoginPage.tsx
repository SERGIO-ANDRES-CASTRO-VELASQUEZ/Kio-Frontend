import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css'; // Los estilos CSS no cambian
import logo from '../assets/logo-kiogloss.svg';

// Usamos React.FC (Functional Component)
export const LoginPage: React.FC = () => {
  // Tipamos el estado
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Tipamos el evento del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/profile'); // Redirigir al perfil tras login
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    }
  };

  // Tipamos los eventos de cambio
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // El JSX no cambia en absoluto
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <img src={logo} alt="Kiogloss" className={styles.logo} />
        <h2>Bienvenida de vuelta</h2>
        <p>Accede a tu cuenta y descubre tu belleza</p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <p className={styles.error}>{error}</p>}
          
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange} // Usamos el handler tipado
            placeholder="tu@email.com"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange} // Usamos el handler tipado
            placeholder="********"
            required
          />

          <Link to="/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
          </Link>

          <button type="submit" className={styles.submitButton}>
            Iniciar Sesión
          </button>
        </form>

        <div className={styles.divider}>o</div>

        <button className={styles.socialButton}>Continuar con Google</button>
        <button className={styles.socialButton}>Continuar con Facebook</button>

        <p className={styles.registerLink}>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};