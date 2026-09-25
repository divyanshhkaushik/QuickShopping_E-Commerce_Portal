import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const faqItems = [
  {
    question: "How do I place an order on QuickShopping?",
    answer:
      "Browse products, add the items you want to cart, proceed to checkout, choose your address and payment option, and place the order from the review screen.",
  },
  {
    question: "How can I track my order status?",
    answer:
      "Go to the Orders section in your account. You can view placed, dispatched, cancelled, and cancellation-request states there.",
  },
  {
    question: "Can I cancel an order after placing it?",
    answer:
      "Yes. From the Orders page you can request cancellation. If the order is already dispatched, the platform will guide you to refuse delivery at the doorstep instead.",
  },
  {
    question: "What happens if a product is marked inactive by a seller?",
    answer:
      "Inactive products remain visible in listings for awareness, but they appear faded, cannot be opened, and cannot be purchased until the seller activates them again.",
  },
  {
    question: "How do I update my profile or password?",
    answer:
      "Open My Account, choose Edit Profile, and use the dedicated forgot-password flow to verify your email, enter OTP, and update your password.",
  },
  {
    question: "Why am I not receiving an OTP email right now?",
    answer:
      "During testing, OTP can be shown through debug mode instead of email. In normal mode, OTP delivery depends on the configured SMTP service and your email provider rules.",
  },
  {
    question: "How do sellers manage products on QuickShopping?",
    answer:
      "Sellers can add, edit, delete, and now also mark products as active or inactive from the My Products section inside Seller Hub.",
  },
  {
    question: "Who should I contact for help?",
    answer:
      "Use the Contact Us page for support-related questions, issue reporting, or account assistance.",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-[#eef3f8] text-[#1f2937]">
      <Navbar />

      <div className="border-b border-[#dfe7f0] bg-[#131921]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#93c5fd]">
            Help Center
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 max-w-3xl text-[#d1d9e3]">
            Find quick answers about orders, account management, products, cancellations, seller controls, and password recovery.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/40 sm:p-8">
          <div className="grid gap-5">
            {faqItems.map((item) => (
              <section
                key={item.question}
                className="rounded-2xl border border-[#e2e8f0] bg-[#fcfdff] p-5"
              >
                <h2 className="text-xl font-bold text-[#111827]">{item.question}</h2>
                <p className="mt-3 text-sm leading-7 text-[#4b5563]">{item.answer}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-[#cbd5e1] bg-[#eff6ff] p-5 text-sm leading-7 text-[#1e3a8a]">
            If your question is not covered here, visit Contact Us for direct support.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FaqPage;