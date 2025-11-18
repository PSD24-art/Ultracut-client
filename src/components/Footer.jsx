function Footer() {
  return (
    <footer id="contact" className="w-full bg-gray-50 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold">Ultracut</div>
            <div className="text-sm text-gray-500 mt-1">
              © {new Date().getFullYear()} Ultracut
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <div>📞 +91 98XXXXXXX</div>
            <div>📧 info@ultracut.com</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
