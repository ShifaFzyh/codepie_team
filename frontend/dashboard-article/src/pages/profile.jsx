import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../css/profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const user = {
    name: localStorage.getItem("name") || "Chisa",
    username: localStorage.getItem("username") || "chisa_editor",
    email: localStorage.getItem("email") || "chisa@example.com",
    role: localStorage.getItem("role") || "user"
  };

  const [stats, setStats] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [dataError, setDataError] = useState(null);

  const fetchData = async () => {
    setLoadingData(true);
    setDataError(null);
    try {
      const statsRes = await API.get('/posts/my-stats');
      setStats(statsRes.data);
      const postsRes = await API.get('/posts/my-posts');
      setMyPosts(postsRes.data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setDataError('Gagal memuat statistik profil Anda.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setFormError(null);
    setFormSuccess(null);

    if (!name.trim()) {
      setFormError('Nama lengkap tidak boleh kosong');
      setUpdating(false);
      return;
    }

    if (password) {
      if (password.length < 6) {
        setFormError('Password baru minimal terdiri dari 6 karakter');
        setUpdating(false);
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Konfirmasi password tidak cocok');
        setUpdating(false);
        return;
      }
    }

    try {
      const payload = { name };
      if (password) payload.password = password;

      const token = localStorage.getItem("token");
      const res = await API.put('/auth/profile', payload);

      localStorage.setItem("name", res.data.user?.name || name);
      setFormSuccess('Profil Anda berhasil diperbarui!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      await API.delete(`/posts/${postId}`);
      setFormSuccess('Artikel berhasil dihapus!');
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError('Gagal menghapus artikel.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      navigate('/');
    }
  };

  return (
    <>
      {/* Konten Utama — Navbar & Footer sudah dihandle di App.jsx via WithNavbar */}
      <div className="container profile-container">

        {/* Header + Tombol Logout */}
        <header className="profile-header">
          <div className="profile-header-top">
            <div>
              <h1 className="profile-title">Profil Pengguna</h1>
              <p className="profile-subtitle">Kelola detail akun Anda dan tinjau metrik artikel Anda.</p>
            </div>
            <button className="profile-logout-btn" onClick={handleLogout}>
              🚪 Keluar / Logout
            </button>
          </div>
        </header>

        {loadingData ? (
          <div className="profile-loader-container">
            <div className="profile-spinner"></div>
            <p>Memuat profil dan statistik Anda...</p>
          </div>
        ) : (
          <>
            {dataError && <div className="alert alert-error">{dataError}</div>}

            {/* Statistik */}
            <section className="profile-stats-section">
              <h3 className="profile-section-title">Statistik & Metrik Ringkasan</h3>

              {user.role === 'admin' ? (
                <div className="grid-3 profile-stats-grid">
                  <div className="card profile-stat-card">
                    <div className="profile-stat-icon">👥</div>
                    <div className="profile-stat-val">{stats?.totalUsers || 0}</div>
                    <div className="profile-stat-label">Total Pengguna</div>
                  </div>
                  <div className="card profile-stat-card">
                    <div className="profile-stat-icon">📰</div>
                    <div className="profile-stat-val">{stats?.totalPublished || 0}</div>
                    <div className="profile-stat-label">Artikel Dipublikasikan</div>
                  </div>
                  <div className="card profile-stat-card">
                    <div className="profile-stat-icon">⏳</div>
                    <div className="profile-stat-val profile-stat-val--secondary">{stats?.totalPending || 0}</div>
                    <div className="profile-stat-label">Menunggu Moderasi</div>
                  </div>
                  <div className="card profile-stat-card profile-stat-card--wide">
                    <div className="profile-stat-icon">👁️</div>
                    <div className="profile-stat-val">{stats?.totalViews || 0}</div>
                    <div className="profile-stat-label">Total Pembaca Platform (Views)</div>
                  </div>
                </div>
              ) : (
                <div className="grid-3 profile-stats-grid">
                  <div className="card profile-stat-card">
                    <div className="profile-stat-icon">📰</div>
                    <div className="profile-stat-val">{stats?.totalPublished || 0}</div>
                    <div className="profile-stat-label">Artikel Anda Rilis</div>
                  </div>
                  <div className="card profile-stat-card">
                    <div className="profile-stat-icon">⏳</div>
                    <div className="profile-stat-val profile-stat-val--secondary">{stats?.totalPending || 0}</div>
                    <div className="profile-stat-label">Artikel Pending Review</div>
                  </div>
                  <div className="card profile-stat-card">
                    <div className="profile-stat-icon">👁️</div>
                    <div className="profile-stat-val">{stats?.totalViews || 0}</div>
                    <div className="profile-stat-label">Total Tayangan Pembaca</div>
                  </div>
                </div>
              )}
            </section>

            <div className="grid-sidebar" style={{ marginTop: '32px' }}>
              {/* Kiri: Form Update */}
              <div>
                <div className="card profile-card-padding">
                  <h3 className="profile-section-title">Perbarui Detail Akun</h3>

                  {formError && <div className="alert alert-error">{formError}</div>}
                  {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        className="form-control profile-disabled-input"
                        value={`@${user.username}`}
                        disabled
                      />
                      <span className="profile-field-hint">Username unik Anda tidak dapat diubah</span>
                    </div>

                    <div className="form-group">
                      <label>Alamat Email</label>
                      <input
                        type="email"
                        className="form-control profile-disabled-input"
                        value={user.email}
                        disabled
                      />
                      <span className="profile-field-hint">Alamat email Anda terikat pada pendaftaran</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">Nama Lengkap</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Ganti Password (Kosongkan jika tidak diubah)</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className="form-control"
                        placeholder="Masukkan password baru"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    {password && (
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          className="form-control"
                          placeholder="Ketik ulang password baru"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary mt-4" disabled={updating}>
                      {updating ? 'Memperbarui...' : 'Simpan Perubahan'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Kanan: Daftar Artikel */}
              <aside>
                <div className="card profile-card-padding">
                  <h3 className="profile-section-title">Daftar Artikel Saya ({myPosts.length})</h3>

                  {myPosts.length === 0 ? (
                    <div className="profile-empty-posts">
                      <p style={{ color: 'var(--light-text)' }}>Anda belum menulis artikel apapun.</p>
                      <button
                        className="btn btn-primary mt-4"
                        onClick={() => navigate(user.role === 'admin' ? '/admin/articles/create' : '/editor/create')}
                      >
                        Mulai Menulis
                      </button>
                    </div>
                  ) : (
                    <div className="profile-posts-list">
                      {myPosts.map(post => (
                        <div key={post.id} className="profile-post-item">
                          <div className="profile-post-item-header">
                            <span
                              className={`badge badge-${post.category_slug || 'default'}`}
                              style={{ fontSize: '10px' }}
                            >
                              {post.category_name}
                            </span>
                            <span
                              className={`profile-status-tag ${
                                post.status === 'published'
                                  ? 'profile-status-tag--published'
                                  : 'profile-status-tag--pending'
                              }`}
                            >
                              {post.status === 'published' ? 'Published' : 'Pending Review'}
                            </span>
                          </div>

                          <h4
                            className="profile-post-item-title"
                            onClick={() => navigate(`/article/${post.slug}`)}
                          >
                            {post.title}
                          </h4>

                          <div className="profile-post-item-footer">
                            <span>👁️ {post.views || 0} views</span>
                            <div className="profile-post-item-actions">
                              <button
                                className="profile-text-link-btn"
                                onClick={() => navigate(`/article/${post.slug}`)}
                              >
                                Tinjau
                              </button>
                              <button
                                className="profile-text-link-btn profile-text-link-btn--danger"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="profile-footer-inner">
          <p className="profile-footer-text">© 2026 ArticleFlow by Codepie. All rights reserved.</p>
          <div className="profile-footer-links">
            <span className="profile-footer-link" onClick={() => navigate('/')}>Beranda</span>
            <span className="profile-footer-divider">·</span>
            <span className="profile-footer-link" onClick={() => navigate('/about')}>About</span>
            <span className="profile-footer-divider">·</span>
            <span className="profile-footer-link" onClick={() => navigate('/writers')}>Penulis</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Profile;
