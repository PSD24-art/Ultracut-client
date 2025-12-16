import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  // OWNER'S WHATSAPP NUMBER (IN INTERNATIONAL FORMAT)
  const phone = import.meta.env.VITE_PHONE_WP;

  const message = encodeURIComponent("Hello! I need help with a product.");
  const whatsappURL = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 bottom-5 right-5 bg-green-500  hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
    >
      <div className="w-14 h-14  hover:scale-110 transition duration-500">
        <img src="/whatsapp.jpg" className="rounded-full" alt="whatsapp" />
      </div>
    </a>
  );
}
