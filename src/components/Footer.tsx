import { Logo } from "./Logo";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container grid gap-10 py-16 md:grid-cols-4">
      <div className="space-y-4">
        <Logo light />
        <p className="text-sm text-primary-foreground/70">
          Kenya's premier marketplace for salons & barbershops. Book beauty and grooming instantly.
        </p>
        <div className="flex gap-3">
          {[Instagram, Facebook, Twitter].map((Icon, i) => (
            <a key={i} href="#" className="hover:bg-accent hover:text-accent-foreground flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 transition-colors">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-4 font-display text-base">Customers</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/70">
          <li><Link to="/explore">Find a salon</Link></li>
          <li><Link to="/explore">Find a kinyozi</Link></li>
          <li><Link to="/login">My bookings</Link></li>
          <li><a href="#">How it works</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 font-display text-base">For Vendors</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/70">
          <li><Link to="/vendor-signup">List your business</Link></li>
          <li><a href="#">Pricing & commission</a></li>
          <li><a href="#">Vendor support</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 font-display text-base">Get in touch</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/70">
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Nairobi, Kenya</li>
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +254 700 000 000</li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> hello@realmi.co.ke</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row">
        <p>© {new Date().getFullYear()} Realmi Kenya. All rights reserved.</p>
        <p>Made with care in Nairobi 🇰🇪</p>
      </div>
    </div>
  </footer>
);