import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background/80">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Logo & Copyright */}
          <div>
            <Link to="/" className="text-2xl font-bold text-background">
              Upkeeply
            </Link>
            <p className="text-sm text-background/60 mt-2">
              © 2026 Upkeeply. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-background/60 hover:text-background transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-background/60 hover:text-background transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@upkeeply.com"
                  className="text-background/60 hover:text-background transition-colors"
                >
                  hello@upkeeply.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
