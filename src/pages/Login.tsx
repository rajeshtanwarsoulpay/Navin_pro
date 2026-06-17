import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err === 'Invalid login credentials' ? 'Invalid email or password' : err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center" style={{ background: 'var(--light)', paddingTop: 0 }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            Haryana<i className="fas fa-graduation-cap"></i>Coach<span style={{ color: 'var(--secondary)' }}>Pro</span>
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>Admin Portal</p>
        </div>
        <div className="auth-card">
          <h4 className="fw-bold text-center mb-1" style={{ color: 'var(--gray-900)' }}>Sign In</h4>
          <p className="text-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>Enter your credentials to access the admin panel</p>
          {error && <div className="alert alert-danger-custom">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Email</label>
              <input type="email" className="form-input" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Password</label>
              <input type="password" className="form-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Signing in...</> : <><i className="fas fa-sign-in-alt me-2"></i>Sign In</>}
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
