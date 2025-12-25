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
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  const subjects = [
    "General Enquiry",
    "Bulk Order",
    "Custom Design / Quote",
    "After Sales / Warranty",
    "Other",
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFile(e) {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() && !form.phone.trim())
      return "Please provide either email or phone number.";
    if (!form.message.trim()) return "Please write your message.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    const error = validate();
    if (error) {
      setStatus({ type: "error", text: error });
      return;
    }

    setSending(true);
    try {
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

      if (!res.ok) throw new Error("Failed to send");

      setStatus({
        type: "success",
        text: "Message sent successfully. Our team will contact you shortly.",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setFile(null);
    } catch (err) {
      setStatus({
        type: "error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="w-full py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ================= LEFT INFO ================= */}
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
            <h1 className="text-2xl font-semibold highlighted-text mb-2">
              Contact Ultracut
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              For laser cutting consumables, bulk orders, custom requirements,
              or support — connect with Ultracut Innovation Technology.
            </p>

            <div className="space-y-5">
              {/* Phone */}
              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Phone className="w-5 h-5 highlighted-text" />
                </div>
                <div>
                  <div className="text-sm font-medium highlighted-text">
                    Phone
                  </div>
                  <a
                    href="tel:+919979139392"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    +91 9979139392
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Mail className="w-5 h-5 highlighted-text" />
                </div>
                <div>
                  <div className="text-sm font-medium highlighted-text">
                    Email
                  </div>
                  <a
                    href="mailto:ultracut.innovation.acct@gmail.com"
                    className="text-sm text-gray-600 hover:underline break-all"
                  >
                    ultracut.innovation.acct@gmail.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-3">
                <div className="p-2 h-10 bg-white rounded-md shadow-sm">
                  <MapPin className="w-5 h-5 highlighted-text" />
                </div>
                <div>
                  <div className="text-sm font-medium highlighted-text">
                    Office Address
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Ultracut Innovation Technology <br />
                    Plot No-6, Parshwa Industrial Plotting <br />
                    Opp. Xylem, Near Bombadear Circle <br />
                    Manjusar G.I.D.C, Savli Road <br />
                    Vadodara – 391775, Gujarat, India
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Clock className="w-5 h-5 highlighted-text" />
                </div>
                <div>
                  <div className="text-sm font-medium highlighted-text">
                    Business Hours
                  </div>
                  <div className="text-sm text-gray-600">
                    Mon – Sat <br />
                    9:30 AM – 6:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div className="border rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold highlighted-text mb-2">
              Send us a message
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Share your requirement and we’ll respond within 24 hours.
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
                  placeholder="Your name *"
                  className="px-3 py-2 border rounded-md w-full focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="px-3 py-2 border rounded-md w-full focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="px-3 py-2 border rounded-md w-full focus:outline-none"
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-md w-full focus:outline-none"
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message *"
                className="px-3 py-2 border rounded-md w-full focus:outline-none"
              />

              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <Paperclip className="w-4 h-4" />
                  Attach file
                </label>
                <input type="file" onChange={handleFile} />
                {file && (
                  <span className="ml-auto text-xs text-gray-500">
                    {file.name}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 btn-color text-white rounded-md font-medium disabled:opacity-60"
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

        {/* ================= MAP ================= */}
        <div className="mt-10 rounded-xl overflow-hidden border">
          <iframe
            title="Ultracut Location"
            loading="lazy"
            src="https://www.google.com/maps?q=Manjusar+GIDC+Vadodara&output=embed"
            className="w-full h-72 border-0"
          />
        </div>
      </div>
    </section>
  );
}
