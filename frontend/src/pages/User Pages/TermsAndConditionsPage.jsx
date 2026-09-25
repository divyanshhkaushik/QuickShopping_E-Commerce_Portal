import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const sections = [
  {
    title: "Acceptance of Terms",
    body:
      "By accessing or using QuickShopping, you agree to follow these terms, our policies, and all applicable laws. If you do not agree, you should stop using the platform.",
  },
  {
    title: "Account Responsibilities",
    body:
      "You are responsible for keeping your account information accurate, protecting your login credentials, and ensuring that activity from your account is authorized by you.",
  },
  {
    title: "Products and Listings",
    body:
      "Product descriptions, prices, stock availability, and seller-provided details may change over time. Sellers are expected to maintain correct listing information, and inactive listings may become unavailable without notice.",
  },
  {
    title: "Orders, Payments, and Cancellations",
    body:
      "Placing an order does not guarantee acceptance until the order is confirmed. Payments, cancellations, refunds, and delivery handling are subject to platform rules, seller fulfillment, and applicable support review.",
  },
  {
    title: "Returns and Support",
    body:
      "Return, replacement, and refund requests may require verification and are handled according to the product category, seller policy, and order status shown on QuickShopping.",
  },
  {
    title: "Prohibited Use",
    body:
      "You must not misuse the platform, attempt unauthorized access, interfere with platform operations, submit false information, or use QuickShopping for fraudulent or unlawful activity.",
  },
  {
    title: "Platform Changes",
    body:
      "QuickShopping may update features, services, policies, and these terms from time to time. Continued use of the platform after updates means you accept the revised terms.",
  },
];

function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#eef3f8] text-[#1f2937]">
      <Navbar />

      <div className="border-b border-[#dfe7f0] bg-[#131921]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#93c5fd]">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Terms and Conditions
          </h1>
          <p className="mt-3 max-w-3xl text-[#d1d9e3]">
            Please review the rules, responsibilities, and general conditions that apply when using QuickShopping as a customer or seller.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/40 sm:p-8">
          <div className="rounded-2xl bg-[#f8fafc] p-5 text-sm leading-7 text-[#475569]">
            These terms are intended to provide a clear working understanding of how QuickShopping operates. Specific features, support outcomes, and seller obligations may also be governed by additional policies shown inside the platform.
          </div>

          <div className="mt-8 space-y-5">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-[#e2e8f0] bg-[#fcfdff] p-5"
              >
                <h2 className="text-xl font-bold text-[#111827]">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#4b5563]">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-[#cbd5e1] bg-[#fff7ed] p-5 text-sm leading-7 text-[#7c2d12]">
            If you have questions about these terms, please use the Contact Us page or the support options available in your QuickShopping account.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TermsAndConditionsPage;