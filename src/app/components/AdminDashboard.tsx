import { useState } from 'react';
import { FileText, LogOut, Download, Search, Users, Filter, Building2 } from 'lucide-react';

interface PDFFile {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
  files: PDFFile[];
}

export function AdminDashboard({ username, onLogout, files }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState('all');

  const uniqueUsers = Array.from(new Set(files.map(f => f.uploadedBy)));

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterUser === 'all' || file.uploadedBy === filterUser;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalFiles: files.length,
    totalUsers: uniqueUsers.length,
    totalSize: files.reduce((acc, file) => {
      const size = parseFloat(file.size);
      return acc + size;
    }, 0).toFixed(2)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-white">SAPA DESA - Admin</h1>
                <p className="text-sm opacity-90">Selamat datang, {username}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-l-4 border-primary shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Dokumen</p>
                <p className="text-primary">{stats.totalFiles}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-secondary shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Pengguna</p>
                <p className="text-primary">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-accent shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Ukuran</p>
                <p className="text-primary">{stats.totalSize} MB</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-primary mb-2">
                Cari Dokumen
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama dokumen atau pengguna..."
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-primary mb-2">
                Filter Pengguna
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary appearance-none"
                >
                  <option value="all">Semua Pengguna</option>
                  {uniqueUsers.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Files Table */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-primary">
              Semua Dokumen Desa ({filteredFiles.length})
            </h2>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || filterUser !== 'all' ? 'Tidak ada dokumen yang cocok dengan filter' : 'Belum ada dokumen yang diupload'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-primary">Nama Dokumen</th>
                    <th className="px-6 py-3 text-left text-primary">Diupload Oleh</th>
                    <th className="px-6 py-3 text-left text-primary">Tanggal Upload</th>
                    <th className="px-6 py-3 text-left text-primary">Ukuran</th>
                    <th className="px-6 py-3 text-left text-primary">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-accent" />
                          </div>
                          <span className="text-primary">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm">
                            {file.uploadedBy.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-muted-foreground">{file.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{file.uploadedAt}</td>
                      <td className="px-6 py-4 text-muted-foreground">{file.size}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => alert('Fitur download akan tersedia setelah integrasi backend')}
                          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
