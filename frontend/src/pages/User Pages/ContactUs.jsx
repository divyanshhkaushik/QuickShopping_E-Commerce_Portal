import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Our support team will contact you shortly.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="shopping-page-shell text-[#111827]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2563eb]">
            Support Center
          </p>
          <h1 className="mt-3 text-4xl font-black text-[#111827]">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[#475569]">
            We&apos;re here to help with orders, product questions, seller support, and general inquiries.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/30 sm:p-8">
            <h2 className="text-2xl font-bold text-[#111827]">Send us a message</h2>
            <p className="mt-2 text-sm text-[#64748b]">
              Fill in the form and our support team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Order, seller, payment, etc."
                    className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1f2937]">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  className="w-full rounded-xl border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#ffd814] px-6 py-3 text-base font-bold text-[#111827] shadow-lg shadow-[#fef3c7] transition hover:bg-[#f7ca00]"
              >
                Send Message
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[#dfe7f0] bg-[#111827] p-6 text-white shadow-xl shadow-[#1e293b]/20">
              <h2 className="text-2xl font-bold">QuickShopping Support</h2>
              <div className="mt-6 space-y-5 text-sm text-slate-200">
                <div>
                  <p className="font-semibold text-[#f7b267]">Call us</p>
                  <p className="mt-1">+91 98765 43210</p>
                </div>

                <div>
                  <p className="font-semibold text-[#f7b267]">Email us</p>
                  <p className="mt-1">support@quickshopping.in</p>
                </div>

                <div>
                  <p className="font-semibold text-[#f7b267]">Visit us</p>
                  <p className="mt-1">12 Market Street, Bengaluru, Karnataka 560001</p>
                </div>

                <div>
                  <p className="font-semibold text-[#f7b267]">Working hours</p>
                  <p className="mt-1">Mon - Sat: 9:00 AM to 8:00 PM</p>
                  <p>Sunday: 10:00 AM to 4:00 PM</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/30">
              <h3 className="text-xl font-bold text-[#111827]">Why contact us?</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#475569]">
                <li>• Order tracking and delivery updates</li>
                <li>• Return and refund support</li>
                <li>• Seller account and listing help</li>
                <li>• Payment, discount, or account issues</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ContactUs;
