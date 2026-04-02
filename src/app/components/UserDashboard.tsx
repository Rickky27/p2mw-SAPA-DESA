import { useState } from 'react';
import { Upload, FileText, LogOut, Download, Trash2, Building2 } from 'lucide-react';

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
      e.target.value = '';
    } else {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    } else {
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

  const userFiles = files.filter(file => file.uploadedBy === username);

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
          <h2 className="text-primary mb-4">Upload Dokumen Desa</h2>
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

        {/* Files List */}
        <div>
          <h2 className="text-primary mb-4">Dokumen Saya ({userFiles.length})</h2>
          {userFiles.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-border">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Belum ada dokumen yang diupload</p>
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
                        <h3 className="text-primary truncate">{file.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => alert('Fitur download akan tersedia setelah integrasi backend')}
                        className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus file ini?')) {
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
