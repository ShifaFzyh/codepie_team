import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

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
      <div className="container" style={styles.profileContainer}>

        {/* Header + Tombol Logout */}
        <header style={styles.header}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.title}>Profil Pengguna</h1>
              <p style={styles.subtitle}>Kelola detail akun Anda dan tinjau metrik artikel Anda.</p>
            </div>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              🚪 Keluar / Logout
            </button>
          </div>
        </header>

        {loadingData ? (
          <div style={styles.loaderContainer}>
            <div style={styles.spinner}></div>
            <p>Memuat profil dan statistik Anda...</p>
          </div>
        ) : (
          <>
            {dataError && <div className="alert alert-error">{dataError}</div>}

            {/* Statistik */}
            <section style={styles.statsSection}>
              <h3 style={styles.sectionTitle}>Statistik & Metrik Ringkasan</h3>

              {user.role === 'admin' ? (
                <div className="grid-3" style={styles.statsGrid}>
                  <div className="card" style={styles.statCard}>
                    <div style={styles.statIcon}>👥</div>
                    <div style={styles.statVal}>{stats?.totalUsers || 0}</div>
                    <div style={styles.statLabel}>Total Pengguna</div>
                  </div>
                  <div className="card" style={styles.statCard}>
                    <div style={styles.statIcon}>📰</div>
                    <div style={styles.statVal}>{stats?.totalPublished || 0}</div>
                    <div style={styles.statLabel}>Artikel Dipublikasikan</div>
                  </div>
                  <div className="card" style={styles.statCard}>
                    <div style={styles.statIcon}>⏳</div>
                    <div style={{ ...styles.statVal, color: 'var(--secondary)' }}>{stats?.totalPending || 0}</div>
                    <div style={styles.statLabel}>Menunggu Moderasi</div>
                  </div>
                  <div className="card" style={{ ...styles.statCard, gridColumn: 'span 3' }}>
                    <div style={styles.statIcon}>👁️</div>
                    <div style={styles.statVal}>{stats?.totalViews || 0}</div>
                    <div style={styles.statLabel}>Total Pembaca Platform (Views)</div>
                  </div>
                </div>
              ) : (
                <div className="grid-3" style={styles.statsGrid}>
                  <div className="card" style={styles.statCard}>
                    <div style={styles.statIcon}>📰</div>
                    <div style={styles.statVal}>{stats?.totalPublished || 0}</div>
                    <div style={styles.statLabel}>Artikel Anda Rilis</div>
                  </div>
                  <div className="card" style={styles.statCard}>
                    <div style={styles.statIcon}>⏳</div>
                    <div style={{ ...styles.statVal, color: 'var(--secondary)' }}>{stats?.totalPending || 0}</div>
                    <div style={styles.statLabel}>Artikel Pending Review</div>
                  </div>
                  <div className="card" style={styles.statCard}>
                    <div style={styles.statIcon}>👁️</div>
                    <div style={styles.statVal}>{stats?.totalViews || 0}</div>
                    <div style={styles.statLabel}>Total Tayangan Pembaca</div>
                  </div>
                </div>
              )}
            </section>

            <div className="grid-sidebar" style={{ marginTop: '32px' }}>
              {/* Kiri: Form Update */}
              <div>
                <div className="card" style={styles.cardPadding}>
                  <h3 style={styles.sectionTitle}>Perbarui Detail Akun</h3>

                  {formError && <div className="alert alert-error">{formError}</div>}
                  {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={`@${user.username}`}
                        disabled
                        style={styles.disabledInput}
                      />
                      <span style={styles.fieldHint}>Username unik Anda tidak dapat diubah</span>
                    </div>

                    <div className="form-group">
                      <label>Alamat Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={user.email}
                        disabled
                        style={styles.disabledInput}
                      />
                      <span style={styles.fieldHint}>Alamat email Anda terikat pada pendaftaran</span>
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
                <div className="card" style={styles.cardPadding}>
                  <h3 style={styles.sectionTitle}>Daftar Artikel Saya ({myPosts.length})</h3>

                  {myPosts.length === 0 ? (
                    <div style={styles.emptyPostsContainer}>
                      <p style={{ color: 'var(--light-text)' }}>Anda belum menulis artikel apapun.</p>
                      <button
                        className="btn btn-primary mt-4"
                        onClick={() => navigate(user.role === 'admin' ? '/admin/articles/create' : '/editor/create')}
                      >
                        Mulai Menulis
                      </button>
                    </div>
                  ) : (
                    <div style={styles.postsList}>
                      {myPosts.map(post => (
                        <div key={post.id} style={styles.postItem}>
                          <div style={styles.postItemHeader}>
                            <span className={`badge badge-${post.category_slug || 'default'}`} style={{ fontSize: '10px' }}>
                              {post.category_name}
                            </span>
                            <span style={{
                              ...styles.statusTag,
                              backgroundColor: post.status === 'published' ? '#ECFDF5' : '#FFFBEB',
                              color: post.status === 'published' ? '#10B981' : '#D97706',
                            }}>
                              {post.status === 'published' ? 'Published' : 'Pending Review'}
                            </span>
                          </div>

                          <h4
                            style={styles.postItemTitle}
                            onClick={() => navigate(`/article/${post.slug}`)}
                          >
                            {post.title}
                          </h4>

                          <div style={styles.postItemFooter}>
                            <span>👁️ {post.views || 0} views</span>
                            <div style={styles.postItemActions}>
                              <button
                                style={styles.textLinkBtn}
                                onClick={() => navigate(`/article/${post.slug}`)}
                              >
                                Tinjau
                              </button>
                              <button
                                style={{ ...styles.textLinkBtn, color: 'var(--danger)' }}
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
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p style={styles.footerText}>© 2026 ArticleFlow by Codepie. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink} onClick={() => navigate('/')}>Beranda</span>
            <span style={styles.footerDivider}>·</span>
            <span style={styles.footerLink} onClick={() => navigate('/about')}>About</span>
            <span style={styles.footerDivider}>·</span>
            <span style={styles.footerLink} onClick={() => navigate('/writers')}>Penulis</span>
          </div>
        </div>
      </footer>
    </>
  );
};

const styles = {
  profileContainer: { paddingTop: '40px', paddingBottom: '60px' },
  header: { marginBottom: '32px' },
  headerTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '16px'
  },
  title: { fontSize: '32px', fontWeight: '800', color: 'var(--dark-text)' },
  subtitle: { fontSize: '15px', color: 'var(--light-text)', marginTop: '6px' },

  // ✅ Tombol Logout Ungu
  logoutBtn: {
    backgroundColor: '#7C3AED',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
  },

  loaderContainer: { textAlign: 'center', padding: '60px' },
  spinner: {
    width: '40px', height: '40px',
    border: '4px solid rgba(79, 70, 229, 0.1)',
    borderRadius: '50%',
    borderLeftColor: 'var(--primary)',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  statsSection: { marginBottom: '20px' },
  sectionTitle: {
    fontSize: '18px', fontWeight: '700',
    marginBottom: '16px', borderBottom: '2px solid var(--border)',
    paddingBottom: '8px', color: 'var(--dark-text)'
  },
  statsGrid: { marginTop: '12px' },
  statCard: { padding: '24px', textAlign: 'center', backgroundColor: '#ffffff' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statVal: { fontSize: '28px', fontWeight: '800', color: 'var(--primary)' },
  statLabel: {
    fontSize: '12px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    color: 'var(--light-text)', marginTop: '4px'
  },
  cardPadding: { padding: '32px', backgroundColor: '#ffffff' },
  disabledInput: {
    backgroundColor: 'var(--bg-light)', color: 'var(--light-text)',
    border: '1px dashed var(--border)', cursor: 'not-allowed'
  },
  fieldHint: { fontSize: '11px', color: 'var(--muted-text)', marginTop: '2px' },
  emptyPostsContainer: { padding: '40px 16px', textAlign: 'center' },
  postsList: {
    display: 'flex', flexDirection: 'column', gap: '16px',
    maxHeight: '520px', overflowY: 'auto', paddingRight: '8px'
  },
  postItem: {
    borderBottom: '1px solid var(--border)', paddingBottom: '16px',
    display: 'flex', flexDirection: 'column', gap: '6px'
  },
  postItemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusTag: { padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' },
  postItemTitle: {
    fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', color: 'var(--dark-text)',
    transition: 'var(--transition)'
  },
  postItemFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', fontSize: '12px', color: 'var(--muted-text)'
  },
  postItemActions: { display: 'flex', gap: '12px' },
  textLinkBtn: {
    background: 'none', border: 'none',
    color: 'var(--primary)', fontWeight: '700',
    cursor: 'pointer', fontSize: '12px',
    fontFamily: 'var(--font)'
  },

  // Footer
  footer: {
    borderTop: '1px solid #E5E7EB',
    backgroundColor: '#ffffff',
    padding: '24px 0',
    marginTop: 'auto'
  },
  footerInner: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '0 24px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '12px'
  },
  footerText: { fontSize: '13px', color: '#9CA3AF' },
  footerLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  footerLink: {
    fontSize: '13px', color: '#6B7280',
    cursor: 'pointer', fontWeight: '500'
  },
  footerDivider: { color: '#D1D5DB', fontSize: '13px' }
};

export default Profile;