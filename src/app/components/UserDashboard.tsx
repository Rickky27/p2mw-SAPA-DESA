import { useState } from 'react';
import { 
  Upload, FileText, LogOut, Download, Trash2, Building2, 
  Search, UserCircle, FilePlus, Clock, CheckCircle, XCircle, 
  AlertCircle, Send, QrCode, FileCheck, Newspaper, CalendarDays, Megaphone
} from 'lucide-react';

interface PDFFile {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

interface LetterRequest {
  id: string;
  type: string;
  status: 'diproses' | 'perbaiki' | 'disetujui' | 'ditolak';
  date: string;
  notes?: string; 
}

interface UserDashboardProps {
  username: string;
  onLogout: () => void;
  files: PDFFile[];
  onUpload: (file: File) => void;
  onDelete: (fileId: string) => void;
}

export function UserDashboard({ username, onLogout, files, onUpload, onDelete }: UserDashboardProps) {
  // Tambahkan 'information' ke dalam union type activeTab
  const [activeTab, setActiveTab] = useState<'documents' | 'requests' | 'information'>('documents');
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State Form Pengajuan Surat
  const [letterType, setLetterType] = useState('Surat Keterangan Domisili');
  const [formData, setFormData] = useState({ nik: '', nama: '', keperluan: '' });
  
  // State dummy Tracking Status
  const [requests, setRequests] = useState<LetterRequest[]>([
    { id: 'REQ-001', type: 'Surat Keterangan Usaha (SKU)', status: 'disetujui', date: '10 Okt 2023' },
    { id: 'REQ-002', type: 'Surat Keterangan Tidak Mampu (SKTM)', status: 'perbaiki', date: '12 Okt 2023', notes: 'Foto KTP buram, mohon upload ulang.' },
    { id: 'REQ-003', type: 'Surat Keterangan Domisili', status: 'diproses', date: '15 Okt 2023' },
  ]);

  // DATA DUMMY: Informasi & Pengumuman Desa
  const villageNews = [
    { id: 1, title: 'Perbaikan Jalan Utama Desa Selesai Dikerjakan', date: '18 Okt 2023', excerpt: 'Proses pengaspalan jalan penghubung antar dusun telah selesai 100%. Akses ekonomi warga kini semakin lancar.', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Penyuluhan Pertanian Organik Bersama Dinas', date: '15 Okt 2023', excerpt: 'Puluhan petani antusias mengikuti pelatihan pembuatan pupuk kompos cair untuk menekan biaya tanam.', image: 'https://images.unsplash.com/photo-1592982537447-6f296316270a?auto=format&fit=crop&q=80&w=400' }
  ];

  const villageAgendas = [
    { id: 1, title: 'Musyawarah Desa (Musdes) RKPDes 2024', date: '25 Okt 2023', time: '09:00 WIB', location: 'Balai Desa' },
    { id: 2, title: 'Kerja Bakti Massal Jelang Musim Hujan', date: '28 Okt 2023', time: '07:00 WIB', location: 'Seluruh Wilayah RT' }
  ];

  const socialAssistanceInfo = {
    title: 'Pencairan BLT Dana Desa Tahap 4',
    date: '1 - 5 November 2023',
    description: 'Diharapkan membawa fotokopi KK dan KTP asli saat pengambilan di Kantor Desa. Harap datang sesuai jadwal antrean RT.'
  };

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

  // Logika Download Surat Resmi (Dengan QR & TTE)
  const handleDownloadOfficialLetter = (req: LetterRequest) => {
    alert(`Mengunduh Dokumen: ${req.type}\n\nDokumen ini telah disahkan secara digital dengan Tanda Tangan Elektronik (TTE) Pimpinan Desa dan dilengkapi QR Code terenkripsi untuk memverifikasi keaslian guna mencegah pemalsuan.`);
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
        
        {/* SECTION 1: PROFIL PIMPINAN */}
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

        {/* TABS NAVIGATION (Ditambah Tab ke-3) */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveTab('information')}
            className={`pb-4 px-4 font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'information' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Megaphone className="w-4 h-4"/> Pusat Informasi
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`pb-4 px-4 font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'documents' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FileText className="w-4 h-4"/> Manajemen Dokumen
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`pb-4 px-4 font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FilePlus className="w-4 h-4"/> Pengajuan Surat Online
          </button>
        </div>

        {/* TAB KONTEN 1: PUSAT INFORMASI DESA (FITUR BARU) */}
        {activeTab === 'information' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Berita Desa */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-primary" />
                <h3 className="text-primary font-bold text-xl">Berita Terkini</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {villageNews.map((news) => (
                  <div key={news.id} className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                    <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
                    <div className="p-5">
                      <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-md">{news.date}</span>
                      <h4 className="font-bold text-primary mt-3 text-lg leading-tight line-clamp-2">{news.title}</h4>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-3">{news.excerpt}</p>
                      <button className="text-primary font-semibold text-sm mt-4 hover:underline">Baca selengkapnya &rarr;</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: Pengumuman Bansos & Agenda */}
            <div className="space-y-8">
              {/* Highlight Bansos */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden">
                <AlertCircle className="absolute -right-4 -top-4 w-24 h-24 text-blue-500 opacity-10" />
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Megaphone className="w-5 h-5 text-blue-600" />
                  <h3 className="text-blue-800 font-bold">Info Bantuan Sosial</h3>
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-blue-900 mb-1">{socialAssistanceInfo.title}</h4>
                  <p className="text-xs font-semibold text-blue-600 mb-3 bg-white w-fit px-2 py-1 rounded-md">Jadwal: {socialAssistanceInfo.date}</p>
                  <p className="text-sm text-blue-800/80 leading-relaxed">{socialAssistanceInfo.description}</p>
                </div>
              </div>

              {/* Agenda Desa */}
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <h3 className="text-primary font-bold">Agenda Kegiatan Desa</h3>
                </div>
                <div className="space-y-4">
                  {villageAgendas.map((agenda) => (
                    <div key={agenda.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex flex-col items-center justify-center bg-primary/5 rounded-lg px-3 py-2 border border-primary/10 min-w-[60px]">
                        <span className="text-xs font-bold text-primary uppercase">{agenda.date.split(' ')[1]}</span>
                        <span className="text-lg font-black text-primary leading-none">{agenda.date.split(' ')[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800 mb-1">{agenda.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {agenda.time}</span>
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3"/> {agenda.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB KONTEN 2: MANAJEMEN DOKUMEN */}
        {activeTab === 'documents' && (
          <div>
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

        {/* TAB KONTEN 3: PENGAJUAN SURAT & TRACKING STATUS */}
        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* FORM PENGAJUAN */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-fit">
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

            {/* TRACKING STATUS & DOWNLOAD SURAT */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-fit">
              <h3 className="text-primary font-bold text-lg mb-6">Status Pengajuan Saya</h3>
              
              {requests.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Belum ada riwayat pengajuan surat.
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-gray-800">{req.type}</h4>
                          <p className="text-xs text-gray-500 mt-1">ID: {req.id} • {req.date}</p>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>
                      
                      {/* CATATAN PETUGAS */}
                      {req.notes && (
                        <div className={`p-3 rounded-lg text-xs border ${req.status === 'perbaiki' ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                          <strong>Catatan Petugas:</strong> {req.notes}
                        </div>
                      )}

                      {/* FITUR TTE & QR CODE MUNCUL JIKA SURAT DISETUJUI */}
                      {req.status === 'disetujui' && (
                        <div className="mt-2 pt-3 border-t border-gray-200/60 flex flex-col gap-3">
                          <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                            <QrCode className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>
                              Dokumen ini telah disahkan dengan <strong>Tanda Tangan Elektronik (TTE)</strong> dan dilengkapi <strong>QR Code</strong> untuk verifikasi anti-pemalsuan.
                            </p>
                          </div>
                          <button 
                            onClick={() => handleDownloadOfficialLetter(req)}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm"
                          >
                            <FileCheck className="w-4 h-4" /> Download Surat Resmi
                          </button>
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