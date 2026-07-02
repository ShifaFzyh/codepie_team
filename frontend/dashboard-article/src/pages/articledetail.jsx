import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../css/articleDetail.css';

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
      <div className="container detail-center-container">
        <div className="detail-spinner"></div>
        <p>Memuat konten artikel...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container detail-center-container">
        <div className="alert alert-error">{error || 'Artikel tidak ditemukan'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Kembali ke Jelajah</button>
      </div>
    );
  }

  const getCategoryClass = (slug) => {
    return `badge badge-${slug}`;
  };

  return (
    <div className="container detail-container">
      {/* Navigation & Back Action */}
      <div className="detail-back-nav">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Jelajah
        </button>
      </div>

      <article className="detail-article">
        {/* Header Metadata */}
        <header className="detail-header">
          <span className={getCategoryClass(post.category_slug || 'default')}>
            {post.category_name}
          </span>
          <h1 className="detail-title">{post.title}</h1>

          <div className="detail-meta-row">
            <div className="detail-author-section">
              <div className="detail-author-avatar">
                {post.author_name ? post.author_name.charAt(0) : 'U'}
              </div>
              <div>
                <div className="detail-author-name">{post.author_name || post.author_username}</div>
                <div className="detail-author-email">{post.author_email}</div>
              </div>
            </div>

            <div className="detail-meta-details">
              <div>Dipublikasikan: <strong>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
              <div>Dilihat: <strong>{post.views || 0} kali</strong></div>
            </div>
          </div>
        </header>

        {/* Thumbnail Image */}
        {post.thumbnail && (
          <div className="detail-thumbnail-container">
            <img
              src={`http://localhost:3000/uploads/thumbnails/${post.thumbnail}`}
              alt={post.title}
              className="detail-thumbnail"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="detail-content-body">
          {post.content.split('\n').map((paragraph, index) => {
            if (!paragraph.trim()) return null;
            return <p key={index} className="detail-paragraph">{paragraph}</p>;
          })}
        </div>

        {/* Document Download & Exports Footer */}
        <footer className="detail-footer-section">
          <h3 className="detail-footer-title">Unduh Artikel & Lampiran</h3>
          <p className="detail-footer-text">
            Simpan artikel ini ke perangkat Anda dalam berbagai format dokumen yang tersedia.
          </p>

          <div className="detail-download-grid">
            <a
              href={`http://localhost:3000/api/posts/${post.slug}/download/pdf`}
              className="btn btn-primary detail-download-btn"
              download
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Unduh Format PDF
            </a>

            <a
              href={`http://localhost:3000/api/posts/${post.slug}/download/docx`}
              className="btn btn-secondary detail-download-btn"
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
                className="btn btn-secondary detail-download-btn detail-download-btn-attachment"
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

export default ArticleDetail;
