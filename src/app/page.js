"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const deletedIdFromUrl = searchParams.get('deletedId');
  
  // Data awal tetap dipertahankan
  const [notes, setNotes] = useState([
    { id: 1, title: "Belajar Next.js", desc: "Belajar Next js sangat asik sekali", date: "24 April 2026" },
    { id: 2, title: "Catatan bisnis", desc: "Rencana strategi pemasaran.", date: "24 April 2026" },
    { id: 3, title: "Info PBO", desc: "Materi penting yang harus dipelajari.", date: "25 April 2026" },
    { id: 4, title: "Jadwal posting art", desc: "Jadwal unggahan konten visual.", date: "26 April 2026" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setEditingNoteId(null);
  };

  const handleSave = () => {
    if (newTitle.trim() === "") return;

    if (editingNoteId) {
      setNotes(notes.map((note) =>
        note.id === editingNoteId
          ? { ...note, title: newTitle, desc: newDesc }
          : note
      ));
    } else {
      const newNote = {
        id: Date.now(),
        title: newTitle,
        desc: newDesc,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      };

      setNotes([newNote, ...notes]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Apakah mau menghapus?");
    if (!confirmed) return;

    setNotes(notes.filter((note) => note.id !== id));
    const url = new URL(window.location.href);
    url.searchParams.set('deletedId', id);
    router.replace(url.pathname + url.search);
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setNewTitle(note.title);
    setNewDesc(note.desc || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    // Background gradient dari pink ke biru muda/putih sesuai foto proyektor
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-blue-100 to-white text-slate-800 font-sans p-6 md:p-12 relative">
      
      {/* Header Elemen Judul */}
      <header className="max-w-4xl mx-auto flex flex-col items-center text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-medium text-indigo-600/80 mb-2">
          Aplikasi Notes
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Kelas: <span className="text-pink-500 bg-white/50 px-2 py-0.5 rounded-full shadow-sm">XI PPLG 2</span>
        </p>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto">
        {/* Notifikasi URL Hapus tetap dipertahankan */}
        {deletedIdFromUrl && (
          <div className="mb-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-2.5 text-xs text-pink-700 shadow-sm">
            Notifikasi URL: catatan ID {deletedIdFromUrl} telah dihapus.
          </div>
        )}

        {/* Layout Grid Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {notes.map((note) => (
            <div 
              key={note.id}
              // Card background warna hijau muda rounded sesuai dengan WhatsApp Image 2026-06-04 at 9.15.43 PM.jpeg
              className="relative p-5 bg-green-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[110px]"
            >
              <div className="pr-16">
                <h3 className="text-lg font-bold text-emerald-950 mb-1">
                  {note.title}
                </h3>
                <p className="text-sm text-emerald-900/80 leading-relaxed mb-2">
                  {note.desc}
                </p>
                <p className="text-[10px] text-emerald-800/50 font-medium">
                  {note.date}
                </p>
              </div>

              {/* Tombol Aksi Bulat Kecil di Sisi Kanan Atas Card */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {/* Tombol Edit Kuning */}
                <button
                  onClick={() => handleEdit(note)}
                  className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 transition shadow-sm flex items-center justify-center text-white text-xs font-bold"
                  title="Edit"
                >
                  <span className="block w-1.5 h-1.5 bg-white rounded-full opacity-80"></span>
                </button>
                {/* Tombol Hapus Merah dengan tanda silang */}
                <button
                  onClick={() => handleDelete(note.id)}
                  className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 transition shadow-sm flex items-center justify-center text-white text-[10px] font-bold"
                  title="Hapus"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button (Tombol Bulat Tambah Pink Menempel di Kanan Bawah Layar) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-400 hover:bg-pink-500 text-white text-3xl font-light rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 z-40"
      >
        +
      </button>

      {/* Modal Popup Input Data */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="relative bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              {editingNoteId ? "Edit Catatan" : "Buat Catatan"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Judul Catatan</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ketik judul di sini..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-400 transition-all text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Deskripsi Singkat</label>
                <textarea 
                  rows="3" 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tulis deskripsi..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-400 transition-all text-sm"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end text-sm">
              <button onClick={closeModal} className="px-4 py-2 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition-colors">
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 shadow-md transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}