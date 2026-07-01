import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ArticleDetail = () => {
  const { slug: postSlug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postSlug) return;
    setLoading(true);
    API.get(`/posts/${postSlug}`)
      .then(res => {
        setPost(res.data.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching post detail:', err);
        setError('Gagal memuat detail artikel. Artikel mungkin telah dihapus atau tidak tersedia.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postSlug]);

  if (loading) {
    return (
      <div className="container" style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p>Memuat konten artikel...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={styles.centerContainer}>
        <div className="alert alert-error">{error || 'Artikel tidak ditemukan'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Kembali ke Jelajah</button>
      </div>
    );
  }

  const getCategoryClass = (slug) => {
    return `badge badge-${slug}`;
  };

  return (
    <div className="container" style={styles.detailContainer}>
      {/* Navigation & Back Action */}
      <div style={styles.backNav}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Jelajah
        </button>
      </div>

      <article style={styles.article}>
        {/* Header Metadata */}
        <header style={styles.header}>
          <span className={getCategoryClass(post.category_slug || 'default')}>
            {post.category_name}
          </span>
          <h1 style={styles.title}>{post.title}</h1>
          
          <div style={styles.metaRow}>
            <div style={styles.authorSection}>
              <div style={styles.authorAvatar}>
                {post.author_name ? post.author_name.charAt(0) : 'U'}
              </div>
              <div>
                <div style={styles.authorName}>{post.author_name || post.author_username}</div>
                <div style={styles.authorEmail}>{post.author_email}</div>
              </div>
            </div>
            
            <div style={styles.metaDetails}>
              <div>Dipublikasikan: <strong>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
              <div>Dilihat: <strong>{post.views || 0} kali</strong></div>
            </div>
          </div>
        </header>

        {/* Thumbnail Image */}
        {post.thumbnail && (
          <div style={styles.thumbnailContainer}>
            <img 
              src={`http://localhost:3000/uploads/thumbnails/${post.thumbnail}`} 
              alt={post.title} 
              style={styles.thumbnail}
            />
          </div>
        )}

        {/* Content Body */}
        <div style={styles.contentBody}>
          {post.content.split('\n').map((paragraph, index) => {
            if (!paragraph.trim()) return null;
            return <p key={index} style={styles.paragraph}>{paragraph}</p>;
          })}
        </div>

        {/* Document Download & Exports Footer */}
        <footer style={styles.footerSection}>
          <h3 style={styles.footerTitle}>Unduh Artikel & Lampiran</h3>
          <p style={styles.footerText}>
            Simpan artikel ini ke perangkat Anda dalam berbagai format dokumen yang tersedia.
          </p>

          <div style={styles.downloadGrid}>
            <a 
              href={`http://localhost:3000/api/posts/${post.slug}/download/pdf`} 
              className="btn btn-primary" 
              style={styles.downloadBtn}
              download
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Unduh Format PDF
            </a>

            <a 
              href={`http://localhost:3000/api/posts/${post.slug}/download/docx`} 
              className="btn btn-secondary" 
              style={styles.downloadBtn}
              download
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Unduh Format Word (.doc)
            </a>

            {/* Original Uploaded Document Attachment */}
            {post.document_path && (
              <a 
                href={`http://localhost:3000/uploads/documents/${post.document_path}`} 
                className="btn btn-secondary" 
                style={{ ...styles.downloadBtn, gridColumn: 'span 2', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Unduh Lampiran Dokumen Asli ({post.document_path.split('.').pop().toUpperCase()})
              </a>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};

const styles = {
  detailContainer: {
    paddingTop: '30px',
    paddingBottom: '80px'
  },
  backNav: {
    marginBottom: '24px'
  },
  centerContainer: {
    padding: '80px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(79, 70, 229, 0.1)',
    borderRadius: '50%',
    borderLeftColor: 'var(--primary)',
    animation: 'spin 1s linear infinite'
  },
  article: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    padding: '40px',
    maxWidth: '850px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    marginTop: '16px',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border)'
  },
  authorSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  authorAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '800'
  },
  authorName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--dark-text)'
  },
  authorEmail: {
    fontSize: '12px',
    color: 'var(--muted-text)'
  },
  metaDetails: {
    fontSize: '13px',
    color: 'var(--light-text)',
    textAlign: 'right'
  },
  thumbnailContainer: {
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    marginBottom: '32px',
    maxHeight: '450px'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  contentBody: {
    fontSize: '16px',
    color: 'var(--dark-text)',
    lineHeight: '1.8',
    marginBottom: '40px'
  },
  paragraph: {
    marginBottom: '20px',
    textAlign: 'justify'
  },
  footerSection: {
    borderTop: '1px solid var(--border)',
    paddingTop: '32px'
  },
  footerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  footerText: {
    fontSize: '14px',
    color: 'var(--light-text)',
    marginBottom: '20px'
  },
  downloadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  downloadBtn: {
    padding: '12px 20px',
    fontWeight: '700'
  }
};

export default ArticleDetail;