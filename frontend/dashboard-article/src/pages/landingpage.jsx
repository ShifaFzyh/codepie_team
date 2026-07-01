import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

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
    <div className="container" style={styles.landingContainer}>
      <header style={styles.header}>
        <div style={styles.headerBadge}>WADAH BERSUARA & BERBAGI FAKTA</div>
        <h1 style={styles.mainTitle}>Temukan Isu Hangat & <span style={styles.gradientText}>Artikel Terkini</span></h1>
        <p style={styles.subtitle}>Referensi terpercaya untuk programming, cyber security, tips & trik, kesehatan, hingga isu global terbaru.</p>
      </header>

      <div className="grid-sidebar">
        {/* Main Content Area */}
        <main>
          {loading ? (
            <div style={styles.stateContainer}>
              <div style={styles.spinner}></div>
              <p>Memuat artikel terbaik untuk Anda...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : posts.length === 0 ? (
            <div style={styles.stateContainer}>
              <h3>Tidak Ada Artikel</h3>
              <p>Tidak ditemukan artikel yang sesuai dengan filter pencarian Anda.</p>
              <button className="btn btn-secondary mt-4" onClick={handleResetFilters}>Reset Semua Filter</button>
            </div>
          ) : (
            <div style={styles.articleList}>
              {posts.map(post => (
                <article className="card" key={post.id} style={styles.articleCard}>
                  <div style={styles.thumbnailWrapper}>
                    {post.thumbnail ? (
                      <img
                        src={`http://localhost:3000/uploads/thumbnails/${post.thumbnail}`}
                        alt={post.title}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <div style={{ ...styles.thumbnailPlaceholder, background: getPlaceholderGradient(post.category_slug) }}>
                        <span>{post.category_name}</span>
                      </div>
                    )}
                    <span className={getCategoryClass(post.category_slug || 'default')} style={styles.floatingBadge}>
                      {post.category_name || 'Umum'}
                    </span>
                  </div>

                  <div style={styles.articleBody}>
                    <div style={styles.articleMeta}>
                      <span>Oleh <strong>{post.author_name || post.author_username || 'Anonim'}</strong></span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>👁️ {post.views || 0} kali dibaca</span>
                    </div>

                    <h2 style={styles.articleTitle} onClick={() => viewDetail(post.slug)}>{post.title}</h2>
                    <p style={styles.articleExcerpt}>
                      {post.content.substring(0, 160)}...
                    </p>

                    <div style={styles.articleFooter}>
                      <button className="btn btn-primary" onClick={() => viewDetail(post.slug)}>
                        Baca Selengkapnya
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>

                      {post.document_path && (
                        <span style={styles.docIndicator} title="Artikel ini memiliki file dokumen lampiran">
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
        <aside style={styles.sidebar}>
          {/* Filter Card */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Cari & Filter</h3>

            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
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

            <hr style={styles.hr} />

            <div style={styles.filterSection}>
              <h4 style={styles.sectionTitle}>Kategori</h4>
              <div style={styles.categoryTags}>
                <button
                  style={selectedCategory === '' ? styles.catTagActive : styles.catTag}
                  onClick={() => setSelectedCategory('')}
                >
                  Semua Kategori
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    style={selectedCategory === cat.slug ? styles.catTagActive : styles.catTag}
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            </div>

            <hr style={styles.hr} />

            <div style={styles.filterSection}>
              <h4 style={styles.sectionTitle}>Tanggal Publish</h4>
              <div className="form-group">
                <label style={styles.subLabel}>Mulai Dari</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label style={styles.subLabel}>Sampai Dengan</label>
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
          <div style={styles.sidebarCard}>
            <div style={styles.trendingHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <h3 style={styles.sidebarTitle}>Trending Now</h3>
            </div>
            {TRENDING_POSTS.map((item, index) => (
              <div key={item.id} style={styles.trendingItem}>
                <span style={styles.trendingNum}>0{index + 1}</span>
                <div>
                  <p style={styles.trendingTitle}>{item.title}</p>
                  <p style={styles.trendingMeta}>{item.readTime}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== THE WEEKLY INSIGHT (NEWSLETTER) ===== */}
          <div style={styles.newsletterCard}>
            <h3 style={styles.newsletterTitle}>The Weekly Insight</h3>
            <p style={styles.newsletterBody}>
              Join 50,000+ readers. Get curated stories and visionary perspectives delivered to your inbox every Sunday.
            </p>
            <input
              type="email"
              placeholder="Email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={styles.newsletterInput}
            />
            <button
              style={styles.newsletterBtn}
              onClick={() => alert('Terima kasih sudah subscribe!')}
            >
              Subscribe
            </button>
            <p style={styles.newsletterDisclaimer}>No spam. Unsubscribe anytime.</p>
          </div>

          {/* ===== RECOMMENDED WRITERS ===== */}
          <div style={styles.sidebarCard}>
            <h3 style={{ ...styles.sidebarTitle, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1.5px', color: 'var(--muted-text)' }}>
              Recommended Writers
            </h3>
            {RECOMMENDED_WRITERS.map(writer => (
              <div key={writer.id} style={styles.writerRow}>
                <div style={styles.writerInfo}>
                  <div style={styles.writerAvatar}>{writer.initials}</div>
                  <div>
                    <p style={styles.writerName}>{writer.name}</p>
                    <p style={styles.writerRole}>{writer.role}</p>
                  </div>
                </div>
                <button style={styles.followBtn}>Follow</button>
              </div>
            ))}
          </div>
          
        </aside>
        
      </div>

      {/* ===== FOOTER ===== */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div>
            <p style={styles.footerBrandName}>Codepie</p>
            <p style={styles.footerDesc}>
              Cultivating a new standard for digital editorial. We blend high-fidelity technology with prestige journalism to explore the frontiers of human ingenuity.
            </p>
            <div style={styles.footerIcons}>
              <span style={styles.footerIconBtn} title="Website">🌐</span>
              <span style={styles.footerIconBtn} title="Share">⎘</span>
              <span style={styles.footerIconBtn} title="Email">@</span>
            </div>
          </div>
          <div>
            <p style={styles.footerColTitle}>Publication</p>
            <p style={styles.footerLink}>Jelajah</p>
            <p style={styles.footerLink}>Penulis</p>
            <p style={styles.footerLink}>About</p>
            <p style={styles.footerLink}>The Weekly Insight</p>
          </div>
          <div>
            <p style={styles.footerColTitle}>Company</p>
            <p style={styles.footerLink}>About</p>
            <p style={styles.footerLink}>Careers</p>
            <p style={styles.footerLink}>Contact</p>
            <p style={styles.footerLink}>Help Center</p>
          </div>
          <div>
            <p style={styles.footerColTitle}>Legal</p>
            <p style={styles.footerLink}>Privacy Policy</p>
            <p style={styles.footerLink}>Terms of Service</p>
            <p style={styles.footerLink}>Cookie Policy</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2025 Codepie. All rights reserved.</p>
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

const styles = {
  landingContainer: {
    paddingTop: '40px',
    paddingBottom: '0px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  headerBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '30px',
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    border: '1px solid rgba(79, 70, 229, 0.15)',
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '16px'
  },
  mainTitle: {
    fontSize: '38px',
    fontWeight: '800',
    letterSpacing: '-1px',
    marginBottom: '12px'
  },
  gradientText: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--light-text)',
    maxWidth: '650px',
    margin: '0 auto'
  },
  articleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  articleCard: {
    display: 'flex',
    flexDirection: 'row',
    height: '240px'
  },
  thumbnailWrapper: {
    width: '280px',
    minWidth: '280px',
    position: 'relative',
    overflow: 'hidden'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition)'
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  floatingBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    zIndex: 1
  },
  articleBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1
  },
  articleMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--muted-text)',
    alignItems: 'center'
  },
  articleTitle: {
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'var(--transition)'
  },
  articleExcerpt: {
    fontSize: '14px',
    color: 'var(--light-text)',
    lineHeight: '1.5'
  },
  articleFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  docIndicator: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--secondary)'
  },
  sidebar: {
    position: 'sticky',
    top: '94px',
    alignSelf: 'start',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sidebarCard: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)'
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px',
    color: 'var(--dark-text)'
  },
  searchForm: {
    marginBottom: '20px'
  },
  hr: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '20px 0'
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--dark-text)'
  },
  subLabel: {
    fontSize: '12px',
    color: 'var(--light-text)'
  },
  categoryTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  catTag: {
    background: 'var(--bg-light)',
    border: '1px solid var(--border)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--light-text)',
    cursor: 'pointer',
    transition: 'var(--transition)'
  },
  catTagActive: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    border: '1px solid transparent',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)'
  },
  stateContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(79, 70, 229, 0.1)',
    borderRadius: '50%',
    borderLeftColor: 'var(--primary)',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  trendingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '8px'
  },
  trendingItem: {
    display: 'flex',
    gap: '14px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid var(--border)',
    alignItems: 'flex-start'
  },
  trendingNum: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--border)',
    minWidth: '24px',
    marginTop: '1px'
  },
  trendingTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--dark-text)',
    lineHeight: '1.4',
    marginBottom: '3px'
  },
  trendingMeta: {
    fontSize: '11px',
    color: 'var(--muted-text)'
  },
  newsletterCard: {
    background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    color: 'white'
  },
  newsletterTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  newsletterBody: {
    fontSize: '13px',
    lineHeight: '1.6',
    opacity: '0.9',
    marginBottom: '16px'
  },
  newsletterInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.35)',
    borderRadius: 'var(--radius)',
    padding: '9px 12px',
    fontSize: '13px',
    color: 'white',
    marginBottom: '10px',
    outline: 'none'
  },
  newsletterBtn: {
    width: '100%',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 'var(--radius)',
    padding: '9px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '8px'
  },
  newsletterDisclaimer: {
    fontSize: '11px',
    textAlign: 'center',
    opacity: '0.6'
  },
  writerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border)'
  },
  writerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  writerAvatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '13px',
    fontWeight: '700'
  },
  writerName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--dark-text)',
    marginBottom: '2px'
  },
  writerRole: {
    fontSize: '12px',
    color: 'var(--secondary)'
  },
  followBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '5px 14px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--dark-text)',
    cursor: 'pointer'
  },
  footer: {
    background: '#1f1f23',
    color: 'rgba(255,255,255,0.6)',
    padding: '56px 40px 28px',
    marginTop: '60px',
    marginLeft: '-20px',
    marginRight: '-20px'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
    maxWidth: '1100px',
    margin: '0 auto 40px'
  },
  footerBrandName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#7C6FE4',
    marginBottom: '12px'
  },
  footerDesc: {
    fontSize: '13px',
    lineHeight: '1.7',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '16px'
  },
  footerIcons: {
    display: 'flex',
    gap: '14px'
  },
  footerIconBtn: {
    fontSize: '18px',
    opacity: '0.5',
    cursor: 'pointer'
  },
  footerColTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#7C6FE4',
    marginBottom: '14px'
  },
  footerLink: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    maxWidth: '1100px',
    margin: '0 auto'
  }
};

export default PublicLanding;