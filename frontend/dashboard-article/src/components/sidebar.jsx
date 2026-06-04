import { useState } from "react";

/**
 * Sidebar: berisi trending, newsletter, dan recommended writers.
 */
const Sidebar = ({ trendingArticles, writers }) => {
  // State: nilai email newsletter
  const [email, setEmail] = useState("");
  // State: status subscribe (idle | loading | success | error)
  const [subscribeStatus, setSubscribeStatus] = useState("idle");
  // State: daftar writer yang sudah di-follow
  const [followedWriters, setFollowedWriters] = useState([]);

  // Handling Event: submit form newsletter
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setSubscribeStatus("error");
      return;
    }
    setSubscribeStatus("loading");
    await new Promise((res) => setTimeout(res, 1000));
    setSubscribeStatus("success");
    setEmail("");
  };

  // Handling Event: klik tombol Follow/Unfollow
  const handleFollowToggle = (writerId) => {
    setFollowedWriters((prev) =>
      prev.includes(writerId)
        ? prev.filter((id) => id !== writerId) // Unfollow
        : [...prev, writerId]                   // Follow
    );
  };

  return (
    <aside className="col-span-4 space-y-xl">
      {/* Trending Now */}
      <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
        <h3 className="font-headline-md text-headline-md mb-lg flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">
            trending_up
          </span>
          Trending Now
        </h3>
        <ul className="space-y-md">
          {trendingArticles.map((item, index) => (
            <li key={item.id} className="flex gap-md group cursor-pointer">
              <span className="font-display-lg text-primary/20 group-hover:text-primary transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="font-label-md text-on-surface group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h4>
                <span className="text-caption text-on-surface-variant">
                  {item.readTime}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-primary p-lg rounded-xl text-on-primary shadow-lg shadow-primary/20">
        <h3 className="font-headline-md text-headline-md mb-sm">
          The Weekly Insight
        </h3>
        <p className="font-body-md mb-lg opacity-90">
          Join 50,000+ readers. Get curated stories and visionary perspectives
          delivered to your inbox every Sunday.
        </p>

        {subscribeStatus === "success" ? (
          // Tampilan sukses — kondisional berdasarkan state
          <div className="bg-white/20 rounded-lg px-sm py-md text-center">
            <span className="material-symbols-outlined text-3xl mb-xs block">
              check_circle
            </span>
            <p className="font-label-md">Terima kasih! Kamu sudah terdaftar.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-sm">
            <input
              className="w-full bg-white/10 border border-white/20 rounded-lg px-md py-sm text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none"
              placeholder="Email address"
              type="email"
              value={email}
              // Handling Event: perubahan input → update state email
              onChange={(e) => {
                setEmail(e.target.value);
                if (subscribeStatus === "error") setSubscribeStatus("idle");
              }}
            />
            {subscribeStatus === "error" && (
              <p className="text-caption text-white/80">
                Masukkan email yang valid.
              </p>
            )}
            <button
              type="submit"
              disabled={subscribeStatus === "loading"}
              className="w-full bg-white text-primary font-label-md py-sm rounded-lg hover:bg-secondary-fixed transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {subscribeStatus === "loading" ? "Mendaftar..." : "Subscribe Now"}
            </button>
          </form>
        )}

        <p className="text-caption mt-md opacity-60 text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>

      {/* Recommended Writers */}
      <div>
        <h3 className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-widest">
          Recommended Writers
        </h3>
        <div className="space-y-sm">
          {writers.map((writer) => {
            const isFollowed = followedWriters.includes(writer.id);
            return (
              <div
                key={writer.id}
                className="flex items-center justify-between p-sm hover:bg-surface-container rounded-lg transition-all group"
              >
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      alt={writer.name}
                      src={writer.avatar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-label-md">{writer.name}</h4>
                    <span className="text-caption text-on-surface-variant">
                      {writer.role}
                    </span>
                  </div>
                </div>
                {/* Handling Event: klik Follow/Unfollow → toggle state followedWriters */}
                <button
                  onClick={() => handleFollowToggle(writer.id)}
                  className={`font-label-md transition-all px-sm py-xs rounded-full text-sm ${
                    isFollowed
                      ? "bg-primary text-on-primary"
                      : "text-primary group-hover:underline"
                  }`}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;