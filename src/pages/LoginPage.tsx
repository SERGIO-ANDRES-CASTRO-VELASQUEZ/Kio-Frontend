import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css'; // ¡Necesitarás crear este archivo CSS!
import logo from '../assets/logo-kiogloss.svg'; // Asume que tienes un logo en assets

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    }
  };
  
  // Redirige si el usuario ya está logueado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/cuenta'); // Redirige al perfil
    }
  }, [isAuthenticated, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* <img src={logo} alt="Kiogloss" className={styles.logo} /> */}
        <h1 className="text-3xl font-bold font-heading text-primary my-4">Kiogloss</h1>
        <h2>Bienvenida de vuelta</h2>
        <p>Accede a tu cuenta y descubre tu belleza</p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <p className={styles.error}>{error}</p>}
          
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email" id="email" value={email}
            onChange={handleEmailChange}
            placeholder="tu@email.com" required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password" id="password" value={password}
            onChange={handlePasswordChange}
            placeholder="********" required
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
          ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;