const Footer = () => {
  const publicationLinks = ["Jelajah", "Penulis", "About", "The Weekly Insight"];
  const companyLinks = ["About", "Careers", "Contact", "Help Center"];
  const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

  return (
    <footer className="w-full mt-xl bg-inverse-surface text-on-surface">
      {/* Kontainer Utama */}
      <div className="w-full px-margin-desktop py-xl flex flex-col md:flex-row justify-between items-start max-w-[1280px] mx-auto gap-xl">
        
        {/* Brand & Description (Diberi flex-1 dan min-w untuk mencegah teks menciut patah vertikal) */}
        <div className="space-y-md max-w-full md:max-w-sm flex-1 min-w-[250px]">
          <span className="font-headline-md text-headline-md font-bold text-on-primary-fixed block">
            InkFlow
          </span>
          <p className="text-surface-dim font-body-md leading-relaxed">
            Cultivating a new standard for digital editorial. We blend
            high-fidelity technology with prestige journalism to explore the
            frontiers of human ingenuity.
          </p>
          <div className="flex gap-md">
            {["public", "share", "alternate_email"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="text-surface-dim hover:text-on-primary-fixed transition-all"
                onClick={(e) => e.preventDefault()}
              >
                <span className="material-symbols-outlined">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns (Diubah lebar otomatis pada md:w-auto agar tidak menjajah kolom kiri) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-xl w-full md:w-auto flex-2">
          <div>
            <h5 className="text-on-primary-fixed font-bold mb-md">Publication</h5>
            <ul className="space-y-sm">
              {publicationLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-surface-dim hover:text-on-primary-fixed hover:underline transition-all font-body-md whitespace-nowrap"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-on-primary-fixed font-bold mb-md">Company</h5>
            <ul className="space-y-sm">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-surface-dim hover:text-on-primary-fixed hover:underline transition-all font-body-md"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h5 className="text-on-primary-fixed font-bold mb-md">Legal</h5>
            <ul className="space-y-sm">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-surface-dim hover:text-on-primary-fixed hover:underline transition-all font-body-md"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-white/10 px-margin-desktop py-lg max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center text-surface-dim text-caption gap-sm">
        <p>© 2024 InkFlow Publishing. All rights reserved.</p>
        <p className="flex items-center gap-xs">
          Made with{" "}
          <span
            className="material-symbols-outlined text-primary text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>{" "}
          in San Francisco
        </p>
      </div>
    </footer>
  );
};

export default Footer;