import { useState } from "react";

/**
 * ArticleCard: menampilkan satu kartu artikel.
 * Mendukung dua mode tampilan: "grid" (default) dan "list".
 * Props:
 *  - article: object data artikel
 *  - viewMode: "grid" | "list"
 */
const ArticleCard = ({ article, viewMode = "grid" }) => {
  // State: apakah kartu sedang di-hover (untuk efek lift)
  const [isHovered, setIsHovered] = useState(false);

  const isListMode = viewMode === "list";

  return (
    <article
      className="group cursor-pointer"
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s ease",
        display: isListMode ? "flex" : "block",
        gap: isListMode ? "16px" : undefined,
        alignItems: isListMode ? "center" : undefined,
      }}
      // Handling Event: hover → toggle state isHovered
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          flexShrink: isListMode ? 0 : undefined,
          width: isListMode ? "160px" : "100%",
          marginBottom: isListMode ? 0 : "8px",
        }}
      >
        <img
          alt={article.imageAlt}
          src={article.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ aspectRatio: "16/10", display: "block" }}
        />
      </div>

      {/* Teks */}
      <div style={{ flex: isListMode ? 1 : undefined }}>
        <span className="font-label-md text-secondary mb-xs block">
          {article.category}
        </span>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-xs group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {!isListMode && (
          <p className="text-on-surface-variant font-body-md line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;