"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production: POST to /api/contact which sends email + WhatsApp to owner
    await new Promise((r) => setTimeout(r, 1200)); // Simulate API call
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setLoading(false);
  };

  const CONTACT_DETAILS = [
    { icon: MapPin, label: "Location", value: "Yala Towers, 1st Floor, Shop 101\nBiashara Street, Nairobi CBD" },
    { icon: Phone, label: "Phone & WhatsApp", value: "0716 057 611\n0736 557 611" },
    { icon: Mail, label: "Email", value: "orders@mensworldkenya.com" },
    { icon: Clock, label: "Opening Hours", value: "Mon–Sat: 8:00 AM – 8:00 PM\nSunday: 10:00 AM – 6:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="bg-brand-dark border-b border-brand-mid py-10">
        <div className="container-site">
          <p className="section-tag">Get in Touch</p>
          <h1 className="font-display text-4xl font-bold text-brand-white">Contact Us</h1>
        </div>
      </div>

      <div className="container-site py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-white mb-2">Visit or Reach Us</h2>
            <p className="text-brand-muted mb-8 leading-relaxed">We&apos;d love to help you find the perfect outfit. Walk into our store or reach us via phone, WhatsApp or email.</p>

            <div className="space-y-6 mb-10">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-sm bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                    <Icon size={16} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-brand-gold mb-1">{label}</p>
                    <p className="text-sm text-brand-muted whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/254716057611?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 rounded-sm font-medium text-sm transition-colors"
            >
              <MessageCircle size={18} />
              Chat with Us on WhatsApp
            </a>

            {/* Map placeholder */}
            <div className="mt-8 rounded-sm overflow-hidden border border-brand-mid bg-brand-dark2 aspect-video flex items-center justify-center">
              <div className="text-center text-brand-muted">
                <MapPin size={24} className="mx-auto mb-2 text-brand-gold" />
                <p className="text-sm">Yala Towers, Biashara Street</p>
                <p className="text-xs mt-1">Nairobi CBD</p>
                <a
                  href="https://maps.google.com/?q=Yala+Towers+Nairobi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-gold hover:underline mt-2 inline-block"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div className="card p-6 lg:p-8">
              <h2 className="font-display text-xl font-bold text-brand-white mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Kamau" className="input" required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input" required />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input" required>
                    <option value="">Select a subject</option>
                    <option>Product Enquiry</option>
                    <option>Order Status</option>
                    <option>Delivery Question</option>
                    <option>Returns & Exchanges</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="How can we help you?" className="input resize-none" required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
