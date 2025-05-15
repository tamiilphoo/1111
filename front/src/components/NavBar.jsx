import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const r = localStorage.getItem('role') || '';
    setIsLoggedIn(!!token);
    setRole(r);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <nav className="nav-bar fade-in-animation">
      <div className="nav-logo">Edems</div>
      <ul className="nav-links">
        <li><Link to="/">Головна</Link></li>
        {isLoggedIn ? (
          <>
            {role === 'admin' ? (
              <li><Link to="/admin">Адмін-панель</Link></li>
            ) : (
              <>
                <li><Link to="/account">Акаунт</Link></li>
                <li><Link to="/cart">Кошик</Link></li>
              </>
            )}
            <li>
              <button className="logout-btn" onClick={handleLogout}>Вийти</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Увійти</Link></li>
            <li><Link to="/register">Реєстрація</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
