import { useState } from 'react';
import { Upload, FileText, LogOut, Download, Trash2, Building2, Search, UserCircle } from 'lucide-react';

interface PDFFile {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

interface UserDashboardProps {
  username: string;
  onLogout: () => void;
  files: PDFFile[];
  onUpload: (file: File) => void;
  onDelete: (fileId: string) => void;
}

export function UserDashboard({ username, onLogout, files, onUpload, onDelete }: UserDashboardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // DATA PROFIL (Hanya Baca/Read-Only)
  // Di aplikasi nyata, data ini dikirim dari parent component yang mendapatkan data dari Admin
  const leaderProfile = {
    name: "H. Ahmad Subarjo, S.T.",
    period: "2020 - 2026",
    vision: "Mewujudkan desa yang mandiri, digital, dan sejahtera melalui pelayanan prima serta transparansi publik.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  };

  // --- Logika Helper (Tetap Sama) ---
  const processUpload = (file: File) => {
    const ktpName = window.prompt('Verifikasi Dokumen: Masukkan NAMA ASLI SESUAI KTP:');
    if (!ktpName || ktpName.trim() === '') return;
    const finalFile = new File([file], `[${ktpName.trim().toUpperCase()}] ${file.name}`, { type: file.type });
    onUpload(finalFile);
  };

  const handleDownload = (file: PDFFile) => {
    const ktpNameInput = window.prompt('Masukkan NAMA SESUAI KTP untuk download:');
    if (!ktpNameInput) return;
    const match = file.name.match(/^\[(.*?)\]/);
    const expected = match ? match[1] : '';
    if (ktpNameInput.trim().toUpperCase() === expected.toUpperCase()) {
      alert('Verifikasi berhasil! Mengunduh...');
    } else {
      alert('Verifikasi gagal!');
    }
  };

  const userFiles = files
    .filter(file => file.uploadedBy === username)
    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-white font-bold">SAPA DESA</h1>
              <p className="text-xs opacity-80">Portal Layanan Warga</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* SECTION 1: TAMPILAN PROFIL KEPALA DESA (READ-ONLY) */}
        <div className="mb-10 bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
          <div className="bg-primary/5 px-6 py-3 border-b border-border flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Informasi Pimpinan Desa</span>
          </div>
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            <img 
              src={leaderProfile.image} 
              alt="Kepala Desa" 
              className="w-32 h-32 rounded-2xl object-cover shadow-md ring-4 ring-gray-50"
            />
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-primary">{leaderProfile.name}</h2>
              <p className="text-secondary font-semibold text-sm">Kepala Desa Periode {leaderProfile.period}</p>
              <div className="mt-4 relative">
                <p className="text-muted-foreground italic leading-relaxed relative z-10">
                  "{leaderProfile.vision}"
                </p>
                <span className="absolute -top-4 -left-2 text-6xl text-gray-100 font-serif z-0">“</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: AREA UPLOAD */}
        <div className="mb-8">
          <h3 className="text-primary font-bold mb-4">Upload Dokumen Baru</h3>
          <div
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); processUpload(e.dataTransfer.files[0]); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging ? 'border-secondary bg-secondary/5' : 'border-border bg-white'
            }`}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-accent" />
            <p className="text-sm font-medium text-primary">Klik atau seret file PDF ke sini untuk upload</p>
            <label className="mt-4 inline-block px-5 py-2 bg-secondary text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity text-sm">
              Pilih Dokumen
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processUpload(file);
                e.target.value = '';
              }} />
            </label>
          </div>
        </div>

        {/* SECTION 3: LIST DOKUMEN SAYA */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-primary font-bold">Dokumen Saya ({userFiles.length})</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari dokumen..." 
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {userFiles.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-dashed">
              <p className="text-muted-foreground text-sm">Tidak ada dokumen ditemukan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userFiles.map((file) => (
                <div key={file.id} className="bg-white p-4 rounded-xl border border-border flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">{file.name.replace(/^\[.*?\]\s*/, '')}</h4>
                      <p className="text-xs text-muted-foreground">{file.size} • {file.uploadedAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDownload(file)} className="p-2 text-secondary hover:bg-secondary/10 rounded-lg"><Download className="w-4 h-4"/></button>
                    <button onClick={() => confirm('Hapus?') && onDelete(file.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}