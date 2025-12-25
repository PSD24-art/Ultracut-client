import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 mt-12">
      {/* MAIN FOOTER */}
      <div className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* BRAND */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Ultracut</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Manufacturer, Supplier & Exporter of high-precision fiber laser
              cutting machines and consumables.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-red-500 transition">
                  Shop by Brands
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/company-information.html"
                  className="hover:text-red-500 transition"
                >
                  Company Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-red-500 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-red-500 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-red-500 transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-red-500 transition">
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>📍 Vadodara, Gujarat, India</div>
              <div>📞 +91 98XXXXXXXX</div>
              <div>📧 info@ultracut.com</div>
              <div className="text-xs text-gray-500 mt-2">
                Mon – Sat: 10:00 AM – 7:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <div>
            © {new Date().getFullYear()} Ultracut Innovation Technology. All
            rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="text-gray-500">GST Registered</span>
            <span className="text-gray-500">Made in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
