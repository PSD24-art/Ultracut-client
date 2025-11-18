import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Paperclip } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text: '' }

  const subjects = [
    "General Enquiry",
    "Bulk Order",
    "Custom Design / Quote",
    "After Sales / Warranty",
    "Other",
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() && !form.phone.trim())
      return "Please provide either an email or phone number.";
    if (!form.message.trim()) return "Please write a message.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const err = validate();
    if (err) {
      setStatus({ type: "error", text: err });
      return;
    }

    setSending(true);
    try {
      // Replace endpoint with your backend route (e.g., /api/contact)
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("subject", form.subject);
      payload.append("message", form.message);
      if (file) payload.append("attachment", file);

      const res = await fetch("/api/contact", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error("Network response was not ok");
      setStatus({
        type: "success",
        text: "Message sent — we will contact you soon.",
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        text: "Failed to send message. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="w-full py-12 bg-white" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Contact Info */}
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Get in touch
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              For enquiries, quotes, bulk orders or support — contact our team.
              Provide as much detail as possible so we can respond quickly.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">Phone</div>
                  <div className="text-sm text-gray-600">+91 98XXXXXXX</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">Email</div>
                  <div className="text-sm text-gray-600">info@ultracut.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    Address
                  </div>
                  <div className="text-sm text-gray-600">
                    Pune, Maharashtra, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">Hours</div>
                  <div className="text-sm text-gray-600">
                    Mon – Sat: 9:30 AM – 6:00 PM
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Quick links
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <a className="text-blue-600 hover:underline" href="#brands">
                  Shop by Brands
                </a>
                <a
                  className="text-blue-600 hover:underline"
                  href="#consumables"
                >
                  All Consumables
                </a>
                <a className="text-blue-600 hover:underline" href="/faq">
                  FAQs
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="rounded-lg p-6 sm:p-8 border">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Send us a message
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tell us what you need — we typically reply within 24 hours.
            </p>

            {status && (
              <div
                className={`mb-4 px-4 py-2 rounded-md text-sm ${
                  status.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name*"
                  className="px-3 py-2 border rounded-md focus:outline-none w-full"
                  required
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className="px-3 py-2 border rounded-md focus:outline-none w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="px-3 py-2 border rounded-md focus:outline-none w-full"
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-md focus:outline-none w-full"
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message*"
                  className="px-3 py-2 border rounded-md focus:outline-none w-full"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Attach file (optional)</span>
                </label>
                <input type="file" onChange={handleFile} className="text-sm" />
                {file && (
                  <div className="text-xs text-gray-500 ml-auto">
                    {file.name}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                    setFile(null);
                    setStatus(null);
                  }}
                  className="px-4 py-2 border rounded-md text-sm"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Optional: small embedded map or image below the two columns */}
        <div className="mt-8 rounded-md overflow-hidden">
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            Map / Location Placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
