import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logocodepie.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Cek status login dari localStorage
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const isLoggedIn = !!token;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>

        {/* Kiri: Logo */}
        <div style={styles.logoWrapper} onClick={() => navigate('/')}>
          <img src={logo} alt="Article Flow Codepie" style={styles.logoImg} />
          <div style={styles.logoText}>
            <span style={styles.logoMain}>ArticleFlow</span>
            <span style={styles.logoSub}>by Codepie</span>
          </div>
        </div>

        {/* Tengah: Nav Links */}
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate('/')}>Jelajah</span>
          
          {/* Menu Penulis & About HANYA muncul jika SUDAH login */}
          {isLoggedIn && (
            <>
              <span style={styles.navLink} onClick={() => navigate('/writers')}>Penulis</span>
              <span style={styles.navLink} onClick={() => navigate('/about')}>About</span>
            </>
          )}
        </div>

        {/* Kanan */}
        <div style={styles.navRight}>

          {isLoggedIn ? (
            /* ===== SUDAH LOGIN ===== */
            <>
              {/* Search Bar (Hanya muncul jika sudah login) */}
              <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                <div style={styles.searchWrapper}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Telusuri"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </form>

              {/* Tulis Artikel - hanya untuk editor/admin */}
              {(role === 'editor' || role === 'admin') && (
                <button
                  style={styles.btnTulis}
                  onClick={() => navigate(role === 'admin' ? '/admin/articles/create' : '/editor/create')}
                >
                  ✏️ Tulis Artikel
                </button>
              )}

              {/* Profil User (Klik mengarah ke halaman profil) */}
              <div style={styles.profileWrapper} onClick={() => navigate('/profile')}>
                <div style={styles.profileAvatar}>
                  {(name || username || '?')[0].toUpperCase()}
                </div>
                <div style={styles.profileInfo}>
                  <span style={styles.profileName}>{name || username}</span>
                  <span style={styles.profileRole}>{role?.toUpperCase()}</span>
                </div>
              </div>
              
              {/* Tombol Keluar di Navbar utama sudah dihapus sesuai request */}
            </>
          ) : (
            /* ===== BELUM LOGIN ===== */
            <button
              style={styles.btnLogin}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'white',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px'
  },

  /* Logo */
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    flexShrink: 0
  },
  logoImg: {
    height: '36px',
    width: 'auto',
    objectFit: 'contain'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1
  },
  logoMain: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#1e3a5f',
    letterSpacing: '-0.3px'
  },
  logoSub: {
    fontSize: '10px',
    fontWeight: '500',
    color: '#1e3a5f',
    opacity: 0.6,
    letterSpacing: '0.5px'
  },

  /* Nav Links Tengah */
  navLinks: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  navLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap'
  },

  /* Kanan */
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px', // Sedikit dinaikkan agar jarak antar item konsisten setelah tombol keluar dihapus
    flexShrink: 0
  },

  /* Search */
  searchForm: {
    display: 'flex'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#F3F4F6',
    border: '1px solid #E5E7EB',
    borderRadius: '20px',
    padding: '7px 14px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    color: '#374151',
    width: '110px'
  },

  /* Tombol Tulis Artikel */
  btnTulis: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #630ed4 0%, #7c3aed 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },

  /* Profil */
  profileWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  profileAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #630ed4 0%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2
  },
  profileName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#191c1e'
  },
  profileRole: {
    fontSize: '10px',
    fontWeight: '500',
    color: '#630ed4'
  },

  /* Tombol Login (belum login) */
  btnLogin: {
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #630ed4 0%, #7c3aed 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default Navbar;