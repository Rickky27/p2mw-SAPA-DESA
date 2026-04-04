import { useState } from 'react';
import { 
  Upload, FileText, LogOut, Download, Trash2, Building2, 
  Search, UserCircle, FilePlus, Clock, CheckCircle, XCircle, 
  AlertCircle, Send 
} from 'lucide-react';

interface PDFFile {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

// Interface baru untuk Pengajuan Surat
interface LetterRequest {
  id: string;
  type: string;
  status: 'diproses' | 'perbaiki' | 'disetujui' | 'ditolak';
  date: string;
  notes?: string; // Catatan dari admin jika ada yang perlu diperbaiki/ditolak
}

interface UserDashboardProps {
  username: string;
  onLogout: () => void;
  files: PDFFile[];
  onUpload: (file: File) => void;
  onDelete: (fileId: string) => void;
}

export function UserDashboard({ username, onLogout, files, onUpload, onDelete }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'requests'>('documents');
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Form Pengajuan Surat
  const [letterType, setLetterType] = useState('Surat Keterangan Domisili');
  const [formData, setFormData] = useState({ nik: '', nama: '', keperluan: '' });
  
  // State dummy untuk Tracking Status (Di aplikasi nyata ini dari database/API)
  const [requests, setRequests] = useState<LetterRequest[]>([
    { id: 'REQ-001', type: 'Surat Keterangan Usaha (SKU)', status: 'disetujui', date: '10 Okt 2023' },
    { id: 'REQ-002', type: 'Surat Keterangan Tidak Mampu (SKTM)', status: 'perbaiki', date: '12 Okt 2023', notes: 'Foto KTP buram, mohon upload ulang.' },
    { id: 'REQ-003', type: 'Surat Keterangan Domisili', status: 'diproses', date: '15 Okt 2023' },
  ]);

  // DATA PROFIL (Hanya Baca/Read-Only)
  const leaderProfile = {
    name: "H. Ahmad Subarjo, S.T.",
    period: "2020 - 2026",
    vision: "Mewujudkan desa yang mandiri, digital, dan sejahtera melalui pelayanan prima serta transparansi publik.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  };

  // --- Logika Helper ---
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

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nik || !formData.nama) {
      alert('Mohon lengkapi data NIK dan Nama.');
      return;
    }
    
    const newRequest: LetterRequest = {
      id: `REQ-${Math.floor(Math.random() * 1000)}`,
      type: letterType,
      status: 'diproses',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setRequests([newRequest, ...requests]);
    setFormData({ nik: '', nama: '', keperluan: '' });
    alert('Pengajuan surat berhasil dikirim!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3"/> Disetujui</span>;
      case 'diproses':
        return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold"><Clock className="w-3 h-3"/> Diproses</span>;
      case 'perbaiki':
        return <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold"><AlertCircle className="w-3 h-3"/> Perbaiki</span>;
      case 'ditolak':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold"><XCircle className="w-3 h-3"/> Ditolak</span>;
      default:
        return null;
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
        
        {/* SECTION 1: TAMPILAN PROFIL KEPALA DESA */}
        <div className="mb-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
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

        {/* TABS NAVIGATION */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('documents')}
            className={`pb-4 px-4 font-bold transition-colors ${activeTab === 'documents' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Manajemen Dokumen
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`pb-4 px-4 font-bold transition-colors ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Pengajuan Surat Online
          </button>
        </div>

        {/* TAB KONTEN 1: MANAJEMEN DOKUMEN */}
        {activeTab === 'documents' && (
          <div>
            {/* AREA UPLOAD */}
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

            {/* LIST DOKUMEN SAYA */}
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
          </div>
        )}

        {/* TAB KONTEN 2: PENGAJUAN SURAT */}
        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* FORM PENGAJUAN */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <FilePlus className="w-5 h-5 text-primary" />
                <h3 className="text-primary font-bold text-lg">Buat Pengajuan Baru</h3>
              </div>
              
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Surat</label>
                  <select 
                    value={letterType}
                    onChange={(e) => setLetterType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option>Surat Keterangan Domisili</option>
                    <option>Surat Keterangan Usaha (SKU)</option>
                    <option>Surat Keterangan Tidak Mampu (SKTM)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                    <input 
                      type="text" 
                      placeholder="16 digit NIK"
                      value={formData.nik}
                      onChange={(e) => setFormData({...formData, nik: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      placeholder="Sesuai KTP"
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan Pengajuan</label>
                  <textarea 
                    rows={3}
                    placeholder="Contoh: Persyaratan melamar pekerjaan"
                    value={formData.keperluan}
                    onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/50"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Dokumen Pendukung (KTP/KK)</label>
                  <input 
                    type="file" 
                    multiple 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4" />
                  Kirim Pengajuan
                </button>
              </form>
            </div>

            {/* TRACKING STATUS */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-primary font-bold text-lg mb-6">Status Pengajuan Saya</h3>
              
              {requests.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Belum ada riwayat pengajuan surat.
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-gray-800">{req.type}</h4>
                          <p className="text-xs text-gray-500 mt-1">ID: {req.id} • {req.date}</p>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>
                      
                      {/* Tampilkan catatan jika ada (terutama untuk status Perbaiki/Ditolak) */}
                      {req.notes && (
                        <div className={`p-3 rounded-lg text-xs border ${req.status === 'perbaiki' ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                          <strong>Catatan Petugas:</strong> {req.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}