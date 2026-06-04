import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Sudah ter-import dengan baik!
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import HeroSection from "../components/herosection";
import ArticleCard from "../components/articlecard";
import Sidebar from "../components/sidebar";

// ── DATA STATIS ──────────────────────────────────────────────
const heroArticle = {
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfO48QQcGvbzfVLDG-PHJPLBmmEZjbxolgDvZ4Nt5Z-vx-gwsicyJlKO8rjfKI5x_4LlDCTD4wznB-TIOPMyIIeCAr98BWTzy1MHGkPruxygPRhVUOQCvErPC2gm1QJ0SVKAkGmkdp5NHi_p4Xa_YtYVyp3IhnxsoYwZLoeLmiIZ1mwFTn-UEZ5osuAp54T-lSNlz4mx-X_iU8xUs61TiLKcUoeBQABoUIEqF2C5aWneliOm3ZyYWVo71vdos5ByGDeubrBaj_W3w",
  imageAlt: "Neural Interface Concept",
  title: "The Neural Narrative: How AI is Rewriting the Human Experience",
  author: "Dr. Elena Vance",
  readTime: "12 min read",
  date: "Aug 24, 2024",
};

const initialArticles = [
  {
    id: 1,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz537iDr6JVyijxljyuxn-ShuBdAQlYg2OOducUsDB4bXyGPHdIF2DjaTeKuTkR28a21gE1PLoLEoyM_Nt3rYV52arKUGG2OaX_RR-Ep3mcvwEjzDAli7bUQYUKTkk_C9YAyQrKz4m1xueS6nP0AOJCCqrbh4X2gMUZL8fPqPkslVvtj-sig3PgZ8ZrgLI6SdNuQVFWMMSwQYDsLUaIK9BvioveRlhkVKgdZoMD9FptOOv8rwGy8ic5ovT90Y_gTocW--sPXxcMA8",
    imageAlt: "Cybersecurity Interface",
    category: "Technology",
    title: "The Quantum Leap in Digital Security",
    excerpt: "Encryption as we know it is changing. Discover how the next generation of quantum computing is forcing a global security overhaul.",
  },
  {
    id: 2,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAv-DapQAKTnjIieV3kUZJNblr-6Wzw_a3CzerMl1ToKzCVnUfmcChkWmvrRH5tTFTfvOvlkhrQQZsh_Z-tntld_bO0T5NjojA23qVQwKdAnC4ZdUkl29Zh08Fk0_epQQjhgkkT5g-5H_KDxut5_KdbPfU0DrsMi0xOz_rKAWYpoCzFYB8GSiV9NBjHMvdQy4EH5Twz22Pk4YD1_u1HTNYPAlGQS6Sj4svt2NHKCt4bFghL34PJVyyy_sAf4JTi37qy3vIpRn2lzIw",
    imageAlt: "Modern Minimalist Office",
    category: "Lifestyle",
    title: "Designing Focus: The New Era of Remote Work",
    excerpt: "How minimalist architecture and smart spatial design are revolutionizing the way we think about the home office.",
  },
  {
    id: 3,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqA1qujSsHlLwZ0BZ19wZX9xKoQoKL6kqpQ46QkH4JcexbfIFe9xG6TKtVHC1uB9FzM3Zb-Oi67bFUndod7p3Youb2JR9feMaL-GIVBHMEl3TFMUS0nGX6mCA5nrW0S5a57v-ajYNgFArkTgb75D0JecRxFU2pi5ba-oaxIDq-ed0NaVfqlQ4OKq9D7-asxdvse4gP6bx_OaGD5B4YX5PNgiIYqHv6I2Wmh5-81j8ObTINpqgcGSIHf3BQmhF9NSD49oMOCbqpMBU",
    imageAlt: "Robotic Hand",
    category: "Technology",
    title: "Beyond Robotics: The Empathy Protocol",
    excerpt: "Exploring the frontier of emotional intelligence in mechanical systems and what it means for the future of caregiving.",
  },
  {
    id: 4,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcCgY6Mcadn6pt3tu404_gLrPds2blNBgMyhx7R34F2fxjDTyrCMKiybvezbnBBhev0r6ATBA01M2c71KSquXNd6tbsfDzY-kexgc7DCeJM0q8ZO-tmrOPF944Lm_Z33KOAQBSqg75OrOEv3XqksPh9Op3ytdoFQASJZeGQKgmV-EaNWHfaMjGbHm-TwLcJHR7N7ADty6oBM8_kdLYMDE3i_pejqCQx3vA5nd5vIeHjk1f5IUOah4kiVf6TnwiXAZbKF27VOGTBys",
    imageAlt: "Students Collaborating",
    category: "Lifestyle",
    title: "The Collective Mind: Social Synergy in 2025",
    excerpt: "New sociological studies suggest that digital connectivity is reshaping our capacity for large-scale creative cooperation.",
  },
];

const extraArticles = [
  {
    id: 5,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfO48QQcGvbzfVLDG-PHJPLBmmEZjbxolgDvZ4Nt5Z-vx-gwsicyJlKO8rjfKI5x_4LlDCTD4wznB-TIOPMyIIeCAr98BWTzy1MHGkPruxygPRhVUOQCvErPC2gm1QJ0SVKAkGmkdp5NHi_p4Xa_YtYVyp3IhnxsoYwZLoeLmiIZ1mwFTn-UEZ5osuAp54T-lSNlz4mx-X_iU8xUs61TiLKcUoeBQABoUIEqF2C5aWneliOm3ZyYWVo71vdos5ByGDeubrBaj_W3w",
    imageAlt: "Future City",
    category: "Culture",
    title: "The Vertical Forest Movement",
    excerpt: "Cities around the world are reimagining green infrastructure by integrating forests into skyscrapers and urban design.",
  },
  {
    id: 6,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz537iDr6JVyijxljyuxn-ShuBdAQlYg2OOducUsDB4bXyGPHdIF2DjaTeKuTkR28a21gE1PLoLEoyM_Nt3rYV52arKUGG2OaX_RR-Ep3mcvwEjzDAli7bUQYUKTkk_C9YAyQrKz4m1xueS6nP0AOJCCqrbh4X2gMUZL8fPqPkslVvtj-sig3PgZ8ZrgLI6SdNuQVFWMMSwQYDsLUaIK9BvioveRlhkVKgdZoMD9FptOOv8rwGy8ic5ovT90Y_gTocW--sPXxcMA8",
    imageAlt: "AI Music",
    category: "Technology",
    title: "AI Musicians: Who Really Owns the Melody?",
    excerpt: "As generative AI composes chart-topping songs, the music industry grapples with copyright, creativity, and authorship.",
  },
];

const trendingArticles = [
  { id: 1, title: "The Decentralized Web: Myths vs Reality", readTime: "4 min read" },
  { id: 2, title: "Bio-Engineered Fashion: Wearing the Future", readTime: "7 min read" },
  { id: 3, title: "City Living: The Vertical Forest Movement", readTime: "5 min read" },
  { id: 4, title: "AI Musicians: Who Really Owns the Melody?", readTime: "9 min read" },
];

const writers = [
  { id: 1, name: "Sarah Jenkins", role: "Tech Strategist", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEGbyh59JPQf_lUia6AMeTcuheEKi-mAFWx31KJiv-PqvXSLSnZ-HhIldQOaXBq530Y0lrrFfiomGrosf77OQ2BjITU_bhrARAGDMivB-xepvLFG_LTVhJO7ILksTqpR7vJU5xVWsACkA_hpR9-mNayUjd5_vs5xDknYRiWHvI_6IY3q06fhm1FPtrxKHRy_ZVUWfe90jEJbhEsb_ZWmX6RBqLDbSMOMeYUsGJhuyEd54EJht_ypyfBRqae1pIPyXqdQc-N1USVIQ" },
  { id: 2, name: "Marco Rossi", role: "Visual Journalist", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7a99sgSjr2u77IY2O9J6dw1RrsnzfFHC3I8M8QpTEOBLnqqt_T7qoardFX-nD6J3G-03FhmjmHfwE-SY9g9BQUSd5vzORPajBfGpA8oxQtZLdzbwBfdzCsonWWmsvG1oN6MlyLg0yH8d-8u520gf6vP9FkKUC22swzqtXq3mLyFWn0ZgN9CYjPa5370Jj_P7NQFZvbz5QxfjBlkaBg07k4i3aQPrA_GwVh2zfBj8wwyV7HoUelDneXqGJaU3ZHf5lOetykv24fbA" },
];
// ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate(); // Inisialisasi fungsi navigasi di sini

  const [articles, setArticles] = useState(initialArticles);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise((res) => setTimeout(res, 1000));
    setArticles((prev) => [...prev, ...extraArticles]);
    setHasMore(false);
    setIsLoadingMore(false);
  };

  return (
    <div
      className="bg-background text-on-surface font-body-md min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── GANTI BAGIAN NAVBAR INI ── */}
      {/* Kita tambahkan prop onLoginClick untuk memicu navigasi ke halaman login */}
      <Navbar onLoginClick={() => navigate("/login")} />

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-[1280px] mx-auto px-margin-desktop mt-xl w-full flex-1">
        {/* Hero Section */}
        <HeroSection article={heroArticle} />

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* ── ARTIKEL UTAMA ── */}
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-lg border-b border-outline-variant pb-xs">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Latest Stories
              </h2>
              <div className="flex gap-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-xs rounded-full transition-all ${
                    viewMode === "grid" ? "bg-primary-fixed text-primary" : "hover:bg-surface-container"
                  }`}
                  title="Grid view"
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-xs rounded-full transition-all ${
                    viewMode === "list" ? "bg-primary-fixed text-primary" : "hover:bg-surface-container"
                  }`}
                  title="List view"
                >
                  <span className="material-symbols-outlined">list</span>
                </button>
              </div>
            </div>

            {/* Grid / List artikel */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-xl" : "flex flex-col gap-lg"}>
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} viewMode={viewMode} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-xl flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-xs px-xl py-sm border border-primary text-primary font-label-md rounded-full hover:bg-primary-fixed-dim transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Memuat...
                    </>
                  ) : (
                    <>
                      Load More Stories
                      <span className="material-symbols-outlined">expand_more</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <Sidebar trendingArticles={trendingArticles} writers={writers} />
        </div>
      </main>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}