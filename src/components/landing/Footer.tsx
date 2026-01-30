import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background/80">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 items-start">
          {/* Logo & Copyright */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-background">
              Upkeeply
            </Link>
            <p className="text-sm text-background/60 mt-2 max-w-sm">
              Property inspections made simple, organized, and paperless.
              The future of property management starts here.
            </p>
            <p className="text-sm text-background/40 mt-4">
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

          {/* Portal Access */}
          <div>
            <h4 className="font-semibold text-background mb-4">Existing Client?</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-background/60 hover:text-background transition-colors inline-flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In to Portal
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@upkeeply.com"
                  className="text-background/60 hover:text-background transition-colors"
                >
                  support@upkeeply.com
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
