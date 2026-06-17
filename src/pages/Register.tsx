import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Register() {
  const { signUp, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await signUp(email, password);
    if (err) {
      setError(err === 'User already registered' ? 'An account with this email already exists' : err);
    } else {
      setSuccess(true);
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
          <h4 className="fw-bold text-center mb-1" style={{ color: 'var(--gray-900)' }}>Create Account</h4>
          <p className="text-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>Register to manage the coaching website</p>
          {error && <div className="alert alert-danger-custom">{error}</div>}
          {success ? (
            <div className="text-center py-3">
              <div className="alert alert-success-custom mb-3"><i className="fas fa-check-circle me-2"></i>Account created! You can now sign in.</div>
              <Link to="/login" className="btn-submit d-block text-center text-decoration-none">Go to Sign In</Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Email</label>
              <input type="email" className="form-input" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Password</label>
              <input type="password" className="form-input" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Confirm Password</label>
              <input type="password" className="form-input" placeholder="Re-enter password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Creating account...</> : <><i className="fas fa-user-plus me-2"></i>Create Account</>}
            </button>
          </form>
          )}
          <div className="text-center mt-3">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
