import { useState } from 'react';
import { Upload, FileText, LogOut, Download, Trash2, Building2, Search } from 'lucide-react';

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
  // State untuk fitur pencarian file
  const [searchQuery, setSearchQuery] = useState('');

  // Fitur verifikasi nama sebelum file disimpan (diupload)
  const processUpload = (file: File) => {
    const confirmedName = window.prompt(
      'Verifikasi nama file sebelum disimpan. Anda bisa mengubah namanya jika perlu:', 
      file.name
    );

    if (confirmedName === null || confirmedName.trim() === '') {
      alert('Upload dibatalkan.');
      return;
    }

    let finalFile = file;
    // Jika user mengubah nama di prompt, buat ulang objek File dengan nama baru
    if (confirmedName !== file.name) {
      const finalName = confirmedName.toLowerCase().endsWith('.pdf') 
        ? confirmedName 
        : `${confirmedName}.pdf`;
      finalFile = new File([file], finalName, { type: file.type });
    }

    onUpload(finalFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      processUpload(file);
      e.target.value = ''; // Reset input
    } else if (file) {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      processUpload(file);
    } else if (file) {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Fitur verifikasi sebelum mengambil/mendownload file
  const handleDownload = (file: PDFFile) => {
    const verification = window.prompt(
      `Verifikasi Pengambilan: Silakan ketik persis nama file di bawah ini untuk mengambil dokumen.\n\nNama File: ${file.name}`
    );

    if (verification === file.name) {
      alert(`Verifikasi berhasil! Dokumen ${file.name} sedang disiapkan untuk diunduh...`);
      // Panggil fungsi download asli dari backend di sini nantinya
    } else if (verification !== null) {
      alert('Verifikasi gagal! Nama dokumen yang Anda masukkan tidak cocok.');
    }
  };

  // Filter file berdasarkan username DAN query pencarian
  const userFiles = files
    .filter(file => file.uploadedBy === username)
    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
                <h1 className="text-white">SAPA DESA</h1>
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
        {/* Upload Area */}
        <div className="mb-8">
          <h2 className="text-primary mb-4 font-semibold text-lg">Upload Dokumen Desa</h2>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-secondary bg-secondary/5 scale-[1.02]'
                : 'border-border bg-white hover:border-secondary'
            }`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-secondary' : 'text-accent'}`} />
            <p className="text-primary mb-2">
              Drag & drop dokumen PDF di sini atau klik untuk memilih
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Format dokumen yang diterima: PDF (Surat, KTP, KK, dll)
            </p>
            <label className="inline-block px-6 py-3 bg-secondary text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
              Pilih Dokumen
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Files List Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-primary font-semibold text-lg">Dokumen Saya ({userFiles.length})</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-secondary focus:border-secondary sm:text-sm"
              />
            </div>
          </div>

          {userFiles.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-border">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Dokumen yang dicari tidak ditemukan' : 'Belum ada dokumen yang diupload'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {userFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-primary font-medium truncate">{file.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Download Button dengan verifikasi */}
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                        title="Ambil / Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
                            onDelete(file.id);
                          }
                        }}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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