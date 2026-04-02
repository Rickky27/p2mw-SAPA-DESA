import { useState } from 'react';
import { Upload, FileText, LogOut, Download, Trash2, Building2, Search, UserCircle } from 'lucide-react';

// ... interface tetap sama

export function UserDashboard({ username, onLogout, files, onUpload, onDelete }: UserDashboardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // DATA PROFIL (Idealnya ini dikirim dari Backend/Admin)
  const leaderProfile = {
    name: "H. Ahmad Subarjo, S.T.",
    period: "2020 - 2026",
    vision: "Mewujudkan desa yang mandiri, digital, dan sejahtera melalui pelayanan prima.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  };

  // ... logika processUpload, handleFileSelect, handleDownload tetap sama ...

  const userFiles = files
    .filter(file => file.uploadedBy === username)
    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-white font-bold uppercase tracking-tight">SAPA DESA</h1>
              <p className="text-xs opacity-80">Layanan Digital Masyarakat</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* FITUR BARU: HERO SECTION PROFIL KADES */}
        <div className="mb-10 bg-white rounded-3xl p-8 shadow-sm border border-border overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative">
            <div className="relative">
              <img 
                src={leaderProfile.image} 
                alt="Kepala Desa" 
                className="w-32 h-32 rounded-2xl object-cover shadow-xl ring-4 ring-accent/20"
              />
              <div className="absolute -bottom-3 -right-3 bg-secondary text-white p-2 rounded-xl shadow-lg">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-center md:text-left space-y-2">
              <span className="px-3 py-1 bg-accent/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                Profil Kepala Desa
              </span>
              <h2 className="text-3xl font-extrabold text-primary">{leaderProfile.name}</h2>
              <p className="text-secondary font-medium uppercase text-sm tracking-widest">
                Periode Masa Jabatan: {leaderProfile.period}
              </p>
              <div className="max-w-xl">
                <p className="text-muted-foreground italic text-lg leading-relaxed">
                  " {leaderProfile.vision} "
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AREA UPLOAD & LIST FILE (Sesuai codingan kamu) */}
        {/* ... (lanjutkan kodingan upload area dan list file di sini) ... */}
        
      </main>
    </div>
  );
}