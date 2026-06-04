const HeroSection = ({ article }) => {
  return (
    <section className="relative w-full h-[600px] rounded-xl overflow-hidden mb-xl group cursor-pointer shadow-xl">
      <img
        alt={article.imageAlt}
        src={article.imageUrl}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(25, 28, 30, 0) 0%, rgba(25, 28, 30, 0.8) 100%)",
        }}
      >
        <div className="mb-md">
          <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-lg font-label-md text-label-md uppercase tracking-wider mb-sm inline-block">
            Featured Story
          </span>
          <h1 className="font-display-lg text-display-lg text-white max-w-3xl mb-md">
            {article.title}
          </h1>
        </div>
        <div className="flex items-center gap-md text-white/90">
          <div className="flex items-center gap-xs">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="font-label-md">{article.author}</span>
          </div>
          <span className="w-1 h-1 bg-white/50 rounded-full"></span>
          <span className="font-body-md">{article.readTime}</span>
          <span className="w-1 h-1 bg-white/50 rounded-full"></span>
          <span className="font-body-md italic opacity-80">{article.date}</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;