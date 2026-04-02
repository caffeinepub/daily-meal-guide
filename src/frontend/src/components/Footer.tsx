import { UtensilsCrossed } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

const FOOTER_LINKS = ["About", "App", "Contact", "Privacy"];

const SOCIAL_LINKS = [
  { Icon: SiFacebook, label: "Facebook", ocid: "footer.facebook.link" },
  { Icon: SiX, label: "X (Twitter)", ocid: "footer.x.link" },
  { Icon: SiInstagram, label: "Instagram", ocid: "footer.instagram.link" },
  { Icon: SiYoutube, label: "YouTube", ocid: "footer.youtube.link" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const utm = `utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-footer-bg text-footer-fg mt-16">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <UtensilsCrossed
                className="w-4 h-4 text-white"
                strokeWidth={2.2}
              />
            </div>
            <span className="font-display font-bold text-lg text-brand">
              MealMaven
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {FOOTER_LINKS.map((link) => (
              <button
                type="button"
                key={link}
                data-ocid={`footer.${link.toLowerCase()}.link`}
                className="text-sm text-footer-fg/60 hover:text-footer-fg transition-colors bg-transparent border-0 cursor-pointer"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ Icon, label, ocid }) => (
              <button
                type="button"
                key={label}
                aria-label={label}
                data-ocid={ocid}
                className="text-footer-fg/50 hover:text-footer-fg transition-colors bg-transparent border-0 cursor-pointer"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-footer-fg/10 text-center">
          <p className="text-xs text-footer-fg/40">
            © {year}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-footer-fg/70 underline underline-offset-2 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
