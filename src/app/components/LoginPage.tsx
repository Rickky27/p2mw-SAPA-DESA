import { useState } from 'react';
import { Lock, User, Building2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userType: 'user' | 'admin', username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication
    if (username === 'admin' && password === 'admin123') {
      onLogin('admin', username);
    } else if (username && password === 'user123') {
      onLogin('user', username);
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-white mb-2">SAPA DESA</h1>
          <p className="text-white/90">Sistem Administrasi dan Pelayanan Arsip Desa</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-primary mb-1">Selamat Datang</h2>
            <p className="text-muted-foreground">Silakan login untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-primary mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-muted-foreground mb-3 text-center">Demo Akun:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-primary">Kepala Desa / Admin</p>
                <p className="text-muted-foreground">Username: admin | Password: admin123</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-primary">Warga / Perangkat Desa</p>
                <p className="text-muted-foreground">Username: (bebas) | Password: user123</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/70 text-sm mt-6">
          © 2026 SAPA DESA. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}
