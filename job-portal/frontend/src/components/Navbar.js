import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🏢 Job<span>Portal</span>
      </Link>

      <div className="nav-links">
        <Link to="/jobs">Browse Jobs</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'employer' && <Link to="/post-job">Post a Job</Link>}
            {user.role === 'jobseeker' && <Link to="/my-applications">My Applications</Link>}
            <Link to="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
