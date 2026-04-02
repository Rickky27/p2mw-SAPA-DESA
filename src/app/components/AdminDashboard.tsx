import { useState } from 'react';
import { FileText, LogOut, Download, Search, Users, Filter, Building2, Edit3, Save, X, UserCircle } from 'lucide-react';

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

  // --- FITUR PROFIL KEPALA DESA ---
  const [isEditing, setIsEditing] = useState(false);
  const [leaderProfile, setLeaderProfile] = useState({
    name: "H. Ahmad Subarjo, S.T.",
    period: "2020 - 2026",
    vision: "Mewujudkan desa yang mandiri, digital, dan sejahtera melalui pelayanan prima.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  });
  // State sementara saat mengetik di modal
  const [tempProfile, setTempProfile] = useState(leaderProfile);

  const handleSaveProfile = () => {
    setLeaderProfile(tempProfile);
    setIsEditing(false);
    alert('Profil Kepala Desa berhasil diperbarui!');
  };
  // --------------------------------

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
    totalSize: files.reduce((acc, file) => acc + parseFloat(file.size), 0).toFixed(2)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-white font-bold">SAPA DESA - Admin</h1>
              <p className="text-sm opacity-90">Selamat datang, {username}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* TAMPILAN PROFIL KADES DI ADMIN */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <img src={leaderProfile.image} alt="Kades" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
            <div>
              <h2 className="text-xl font-bold text-primary">{leaderProfile.name}</h2>
              <p className="text-muted-foreground text-sm">Masa Jabatan: {leaderProfile.period}</p>
              <p className="text-xs italic text-secondary mt-1">"{leaderProfile.vision}"</p>
            </div>
          </div>
          <button 
            onClick={() => { setTempProfile(leaderProfile); setIsEditing(true); }}
            className="flex items-center space-x-2 px-6 py-2 bg-accent text-primary rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profil Kades</span>
          </button>
        </div>

        {/* MODAL EDIT PROFIL */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <UserCircle className="w-5 h-5" /> Pengaturan Profil
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500"><X /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Nama Kepala Desa</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-secondary outline-none" 
                    value={tempProfile.name} onChange={e => setTempProfile({...tempProfile, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Masa Jabatan</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-secondary outline-none" 
                    value={tempProfile.period} onChange={e => setTempProfile({...tempProfile, period: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Visi & Misi</label>
                  <textarea rows={3} className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-secondary outline-none" 
                    value={tempProfile.vision} onChange={e => setTempProfile({...tempProfile, vision: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={handleSaveProfile} className="flex-1 bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-l-4 border-primary shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Dokumen</p>
                <p className="text-2xl font-bold text-primary">{stats.totalFiles}</p>
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
                <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
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
                <p className="text-2xl font-bold text-primary">{stats.totalSize} MB</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Table tetap sama */}
        {/* ... (lanjutkan dengan kodingan filter dan tabel yang kamu miliki) ... */}
      </main>
    </div>
  );
}