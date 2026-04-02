import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';

interface PDFFile {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ type: 'user' | 'admin' | null; username: string | null }>({
    type: null,
    username: null,
  });

  const [files, setFiles] = useState<PDFFile[]>([
    {
      id: '1',
      name: 'Surat Keterangan Domisili - Andi Wijaya.pdf',
      uploadedBy: 'admin',
      uploadedAt: '28 Maret 2026',
      size: '0.8 MB',
    },
    {
      id: '2',
      name: 'Permohonan Bantuan Sosial - Siti Nurhaliza.pdf',
      uploadedBy: 'siti',
      uploadedAt: '29 Maret 2026',
      size: '1.2 MB',
    },
    {
      id: '3',
      name: 'Surat Pengantar KTP - Budi Santoso.pdf',
      uploadedBy: 'budi',
      uploadedAt: '30 Maret 2026',
      size: '0.5 MB',
    },
    {
      id: '4',
      name: 'Laporan Kegiatan RT 05 - Maret 2026.pdf',
      uploadedBy: 'admin',
      uploadedAt: '31 Maret 2026',
      size: '2.3 MB',
    },
    {
      id: '5',
      name: 'Surat Izin Usaha Warung - Ibu Fatimah.pdf',
      uploadedBy: 'fatimah',
      uploadedAt: '1 April 2026',
      size: '1.5 MB',
    },
  ]);

  const handleLogin = (userType: 'user' | 'admin', username: string) => {
    setCurrentUser({ type: userType, username });
  };

  const handleLogout = () => {
    setCurrentUser({ type: null, username: null });
  };

  const handleUpload = (file: File) => {
    const newFile: PDFFile = {
      id: Date.now().toString(),
      name: file.name,
      uploadedBy: currentUser.username || '',
      uploadedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    };

    setFiles([...files, newFile]);
  };

  const handleDelete = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  if (!currentUser.type) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.type === 'admin') {
    return (
      <AdminDashboard
        username={currentUser.username || ''}
        onLogout={handleLogout}
        files={files}
      />
    );
  }

  return (
    <UserDashboard
      username={currentUser.username || ''}
      onLogout={handleLogout}
      files={files}
      onUpload={handleUpload}
      onDelete={handleDelete}
    />
  );
}