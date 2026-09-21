import { useState, useEffect } from 'react';

function App() {
  // --- STATE (DURUM) YÖNETİMİ ---
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('crud_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [];
  });

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', company: '' });

  // --- İSTATİSTİK HESAPLAMALARI ---
  const totalUsers = users.length;
  const apiUsersCount = users.filter(u => !u.isLocal).length;
  const localUsersCount = users.filter(u => u.isLocal).length;

  // --- API'DEN VERİ ÇEKME ---
  useEffect(() => {
    if (users.length === 0 && !localStorage.getItem('crud_users')) {
      fetchAPIUsers();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('crud_users', JSON.stringify(users));
  }, [users]);

  const fetchAPIUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      
      const formattedData = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company.name,
        isLocal: false
      }));
      setUsers(formattedData);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    }
  };

  // --- CRUD İŞLEMLERİ ---
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      isLocal: true
    };

    setUsers([newUser, ...users]);
    setFormData({ name: '', email: '', phone: '', company: '' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")){
        setUsers(users.filter(user => user.id !== id));
    }
  };

  const startEditing = (user) => {
    setEditId(user.id);
    setEditFormData({ name: user.name, email: user.email, phone: user.phone, company: user.company });
  };

  const saveEdit = (id) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...editFormData } : user
    );
    setUsers(updatedUsers);
    setEditId(null);
  };

  const resetAndFetch = () => {
    if(window.confirm("Tüm yerel eklemeler silinecek ve API'den orijinal veriler çekilecek. Emin misiniz?")){
        localStorage.removeItem('crud_users');
        fetchAPIUsers();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ÜST BİLGİ KARTI (İSMİNİN EKLENDİĞİ YER) */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 text-white text-center shadow-lg relative">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            🚀 React CRUD Uygulaması
          </h1>
          <p className="text-purple-100 mt-2 text-sm">
            API'den veri çekme, LocalStorage yönetimi ve CRUD işlemleri
          </p>
          
          {/* GELİŞTİRİCİ KİMLİK ROZETİ */}
          <div className="mt-4 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-medium border border-white/30 shadow-sm">
            <span className="flex items-center gap-1">👨‍💻 Geliştirici: <strong>Yiğit Ata</strong></span>
            <span className="text-white/50">|</span>
            <span className="flex items-center gap-1">📁 GitHub: <strong>WeatacaN</strong></span>
          </div>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-2xl font-bold text-violet-600">{totalUsers}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Toplam Kullanıcı</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{apiUsersCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">API'den Gelen</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="text-2xl font-bold text-emerald-600">{localUsersCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Lokal Eklenen</div>
          </div>
        </div>

        {/* YENİLE BUTONU */}
        <div className="flex justify-center">
          <button 
            onClick={resetAndFetch}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 px-6 rounded-full shadow transition-colors"
          >
            🔄 API'den Yenile (LocalStorage Sıfırla)
          </button>
        </div>

        {/* EKLEME FORMU */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-violet-700 mb-4 flex items-center gap-2">
            ➕ Yeni Kullanıcı Ekle
          </h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Ad Soyad *</label>
                <input required type="text" placeholder="Örn: Yiğit Ata Çankaya" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email *</label>
                <input required type="email" placeholder="Örn: yigitcankaya83@gmail.com" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Telefon</label>
                <input type="text" placeholder="Örn: 0532 123 4567" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-500 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Şirket</label>
                <input type="text" placeholder="Örn: WeatacaN" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-500 outline-none" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-6 rounded-lg transition-colors mt-2">
              Kullanıcı Ekle
            </button>
          </form>
        </div>

        {/* LİSTELEME ALANI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            👥 Kullanıcı Listesi
          </h2>
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-center text-slate-500 py-4">Kullanıcı bulunamadı.</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
                  
                  {editId === user.id ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input type="text" className="border p-1 rounded" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                      <input type="text" className="border p-1 rounded" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
                      <input type="text" className="border p-1 rounded" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(user.id)} className="bg-emerald-500 text-white px-3 py-1 rounded text-sm w-full">Kaydet</button>
                        <button onClick={() => setEditId(null)} className="bg-slate-400 text-white px-3 py-1 rounded text-sm w-full">İptal</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">{user.name}</h3>
                          {user.isLocal ? 
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Lokal</span> : 
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">API</span>
                          }
                        </div>
                        <div className="text-sm text-slate-500 grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                          <p>✉️ {user.email}</p>
                          <p>📱 {user.phone}</p>
                          <p>🏢 {user.company}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEditing(user)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Düzenle</button>
                        <button onClick={() => handleDelete(user.id)} className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Sil</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
