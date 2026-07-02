import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../css/landingPage.css';

const TRENDING_POSTS = [
  { id: 1, title: 'The Decentralized Web: Myths vs Reality', readTime: '4 min read' },
  { id: 2, title: 'Bio-Engineered Fashion: Wearing the Future', readTime: '7 min read' },
  { id: 3, title: 'City Living: The Vertical Forest Movement', readTime: '5 min read' },
  { id: 4, title: 'AI Musicians: Who Really Owns the Melody?', readTime: '9 min read' },
];

const RECOMMENDED_WRITERS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Tech Strategist', initials: 'SJ' },
  { id: 2, name: 'Marco Rossi', role: 'Visual Journalist', initials: 'MR' },
];

const PublicLanding = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch Categories
  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch Posts with Filters
  const fetchPosts = () => {
    setLoading(true);
    let params = { status: 'published' };
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    API.get('/posts', { params })
      .then(res => {
        setPosts(res.data.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setError('Gagal memuat artikel. Silakan coba lagi.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    API.get('/posts', { params: { status: 'published' } })
      .then(res => setPosts(res.data.data))
      .catch(err => console.error(err));
  };

  const getCategoryClass = (slug) => {
    return `badge badge-${slug}`;
  };

  const viewDetail = (slug) => {
    navigate(`/artikel/${slug}`);
  };

  return (
    <div className="container landing-container">
      <header className="header">
        <div className="header-badge">WADAH BERSUARA & BERBAGI FAKTA</div>
        <h1 className="main-title">
          Temukan Isu Hangat & <span className="gradient-text">Artikel Terkini</span>
        </h1>
        <p className="subtitle">
          Referensi terpercaya untuk programming, cyber security, tips & trik, kesehatan, hingga isu global terbaru.
        </p>
      </header>

      <div className="grid-sidebar">
        {/* Main Content Area */}
        <main>
          {loading ? (
            <div className="state-container">
              <div className="spinner"></div>
              <p>Memuat artikel terbaik untuk Anda...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : posts.length === 0 ? (
            <div className="state-container">
              <h3>Tidak Ada Artikel</h3>
              <p>Tidak ditemukan artikel yang sesuai dengan filter pencarian Anda.</p>
              <button className="btn btn-secondary mt-4" onClick={handleResetFilters}>Reset Semua Filter</button>
            </div>
          ) : (
            <div className="article-list">
              {posts.map(post => (
                <article className="card article-card" key={post.id}>
                  <div className="thumbnail-wrapper">
                    {post.thumbnail ? (
                      <img
                        src={`http://localhost:3000/uploads/thumbnails/${post.thumbnail}`}
                        alt={post.title}
                        className="thumbnail"
                      />
                    ) : (
                      <div
                        className="thumbnail-placeholder"
                        style={{ background: getPlaceholderGradient(post.category_slug) }}
                      >
                        <span>{post.category_name}</span>
                      </div>
                    )}
                    <span className={`${getCategoryClass(post.category_slug || 'default')} floating-badge`}>
                      {post.category_name || 'Umum'}
                    </span>
                  </div>

                  <div className="article-body">
                    <div className="article-meta">
                      <span>Oleh <strong>{post.author_name || post.author_username || 'Anonim'}</strong></span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>👁️ {post.views || 0} kali dibaca</span>
                    </div>

                    <h2 className="article-title" onClick={() => viewDetail(post.slug)}>{post.title}</h2>
                    <p className="article-excerpt">
                      {post.content.substring(0, 160)}...
                    </p>

                    <div className="article-footer">
                      <button className="btn btn-primary" onClick={() => viewDetail(post.slug)}>
                        Baca Selengkapnya
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>

                      {post.document_path && (
                        <span className="doc-indicator" title="Artikel ini memiliki file dokumen lampiran">
                          📄 Lampiran Tersedia
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Filter Card */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Cari & Filter</h3>

            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="form-group">
                <label>Pencarian</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Judul, isi, penulis..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary full-width">Cari Artikel</button>
            </form>

            <hr className="hr" />

            <div className="filter-section">
              <h4 className="section-title">Kategori</h4>
              <div className="category-tags">
                <button
                  className={selectedCategory === '' ? 'cat-tag-active' : 'cat-tag'}
                  onClick={() => setSelectedCategory('')}
                >
                  Semua Kategori
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={selectedCategory === cat.slug ? 'cat-tag-active' : 'cat-tag'}
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            </div>

            <hr className="hr" />

            <div className="filter-section">
              <h4 className="section-title">Tanggal Publish</h4>
              <div className="form-group">
                <label className="sub-label">Mulai Dari</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="sub-label">Sampai Dengan</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-secondary full-width mt-4" onClick={handleResetFilters}>
              Reset Semua Filter
            </button>
          </div>

          {/* ===== TRENDING NOW ===== */}
          <div className="sidebar-card">
            <div className="trending-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <h3 className="sidebar-title">Trending Now</h3>
            </div>
            {TRENDING_POSTS.map((item, index) => (
              <div key={item.id} className="trending-item">
                <span className="trending-num">0{index + 1}</span>
                <div>
                  <p className="trending-title">{item.title}</p>
                  <p className="trending-meta">{item.readTime}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== THE WEEKLY INSIGHT (NEWSLETTER) ===== */}
          <div className="newsletter-card">
            <h3 className="newsletter-title">The Weekly Insight</h3>
            <p className="newsletter-body">
              Join 50,000+ readers. Get curated stories and visionary perspectives delivered to your inbox every Sunday.
            </p>
            <input
              type="email"
              placeholder="Email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="newsletter-input"
            />
            <button
              className="newsletter-btn"
              onClick={() => alert('Terima kasih sudah subscribe!')}
            >
              Subscribe
            </button>
            <p className="newsletter-disclaimer">No spam. Unsubscribe anytime.</p>
          </div>

          {/* ===== RECOMMENDED WRITERS ===== */}
          <div className="sidebar-card">
            <h3 className="sidebar-title" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1.5px', color: 'var(--muted-text)' }}>
              Recommended Writers
            </h3>
            {RECOMMENDED_WRITERS.map(writer => (
              <div key={writer.id} className="writer-row">
                <div className="writer-info">
                  <div className="writer-avatar">{writer.initials}</div>
                  <div>
                    <p className="writer-name">{writer.name}</p>
                    <p className="writer-role">{writer.role}</p>
                  </div>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
            ))}
          </div>

        </aside>

      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand-name">Codepie</p>
            <p className="footer-desc">
              Cultivating a new standard for digital editorial. We blend high-fidelity technology with prestige journalism to explore the frontiers of human ingenuity.
            </p>
            <div className="footer-icons">
              <span className="footer-icon-btn" title="Website">🌐</span>
              <span className="footer-icon-btn" title="Share">⎘</span>
              <span className="footer-icon-btn" title="Email">@</span>
            </div>
          </div>
          <div>
            <p className="footer-col-title">Publication</p>
            <p className="footer-link">Jelajah</p>
            <p className="footer-link">Penulis</p>
            <p className="footer-link">About</p>
            <p className="footer-link">The Weekly Insight</p>
          </div>
          <div>
            <p className="footer-col-title">Company</p>
            <p className="footer-link">About</p>
            <p className="footer-link">Careers</p>
            <p className="footer-link">Contact</p>
            <p className="footer-link">Help Center</p>
          </div>
          <div>
            <p className="footer-col-title">Legal</p>
            <p className="footer-link">Privacy Policy</p>
            <p className="footer-link">Terms of Service</p>
            <p className="footer-link">Cookie Policy</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Codepie. All rights reserved.</p>
          <p>Made with <span style={{ color: '#7C6FE4' }}>♥</span> in Fullstack</p>
        </div>
      </footer>

    </div>
  );
};

// Custom dynamic gradients for placeholder cards
const getPlaceholderGradient = (slug) => {
  switch (slug) {
    case 'programming': return 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)';
    case 'cyber-security': return 'linear-gradient(135deg, #DC2626 0%, #7C3AED 100%)';
    case 'web-development': return 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)';
    case 'tips-trik': return 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)';
    case 'kesehatan': return 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)';
    case 'politik': return 'linear-gradient(135deg, #374151 0%, #6B7280 100%)';
    case 'isu-global': return 'linear-gradient(135deg, #0284C7 0%, #34D399 100%)';
    case 'kecantikan': return 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)';
    case 'makanan': return 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)';
    case 'liburan': return 'linear-gradient(135deg, #22C55E 0%, #06B6D4 100%)';
    case 'penelitian': return 'linear-gradient(135deg, #00838F 0%, #00ACC1 100%)';
    case 'komputer': return 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)';
    default: return 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)';
  }
};


export default PublicLanding;
