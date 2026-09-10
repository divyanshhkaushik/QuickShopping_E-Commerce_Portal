import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import bannerOne from "../../assets/Shopping_Banner_1.jpg";
import bannerTwo from "../../assets/Shopping_Banner_2.jpg";
import bannerThree from "../../assets/Shopping_Banner_3.jpg";
import productImage from "../../assets/echo1.jpg";

const features = [
  {
    title: "Fast checkout",
    text: "Enjoy a simple and secure buying flow designed for speed and confidence.",
  },
  {
    title: "Exclusive deals",
    text: "Unlock special pricing and fresh offers that help you save more every day.",
  },
  {
    title: "Smart shopping",
    text: "Discover products that fit your needs with a clean, category-focused experience.",
  },
];

const stats = [
  { label: "Happy shoppers", value: "25k+" },
  { label: "Products listed", value: "2.4k" },
  { label: "Avg. rating", value: "4.9/5" },
];

const promoCards = [
  { title: "Home essentials", image: bannerOne, accent: "bg-[#dbeafe]" },
  { title: "Smart living", image: bannerTwo, accent: "bg-[#fef3c7]" },
  { title: "Trending styles", image: bannerThree, accent: "bg-[#e0f2fe]" },
];

function LandingPage() {
  return (
    <div className="shopping-page-shell no-bg text-[#1f2937]">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-full border border-[#dfe7f0] bg-[#131921] px-4 py-3 shadow-lg shadow-[#1d2c3c]/20 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="QuickShopping logo"
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="text-lg font-bold tracking-tight text-white">QuickShopping</p>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm text-[#d1d9e3] md:flex">
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#offers" className="transition hover:text-white">Offers</a>
              <a href="#reviews" className="transition hover:text-white">Reviews</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full border border-[#374151] bg-[#1f2937] px-4 py-2 text-sm font-medium text-white transition hover:border-[#f59e0b] hover:text-[#fef3c7]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-[#ffb347] to-[#f28c28] px-4 py-2 text-sm font-semibold text-[#111827] shadow-lg shadow-[#f59e0b]/30 transition hover:scale-[1.02]"
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        <main className="mt-10 lg:mt-16">
          <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-xl">
              <span className="inline-flex items-center rounded-full border border-[#f5c66b]/60 bg-[#fff3df] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">
                For Everything you need
              </span>
              <h1 className="section-title mt-6 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
                Shop smarter.
                <span className="block bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#f59e0b] bg-clip-text text-transparent">
                  Save bigger.
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#4b5563]">
                Welcome to QuickShopping — your destination for stylish essentials, trending tech,
                and exclusive deals that make every purchase feel worth it.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="primary-button px-6 py-3 text-base"
                >
                  Get started
                </Link>
                <Link
                  to="/login"
                  className="secondary-button px-6 py-3 text-base"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#4b5563]">
                <div>
                  <span className="block text-2xl font-bold text-[#111827]">4.9/5</span>
                  <span>Average rating</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-[#111827]">24h</span>
                  <span>Fast shipping</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-[#93c5fd]/40 blur-3xl" />
              <div className="absolute -right-10 bottom-8 h-28 w-28 rounded-full bg-[#f7b267]/25 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-[#dfe7f0] bg-white p-4 shadow-2xl shadow-[#cbd5e1]/40 backdrop-blur-xl">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-[#edf5ff] via-[#f8fafc] to-[#ffffff] p-5">
                  <div className="mb-5 flex items-center justify-between text-xs text-[#475569]">
                    <span>Trending now</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Live</span>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="overflow-hidden rounded-[1.5rem] border border-[#dfe7f0] bg-white p-2 shadow-sm">
                      <img
                        src={productImage}
                        alt="Featured product"
                        className="h-56 w-full rounded-[1.2rem] object-cover"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.3rem] bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] p-4">
                        <p className="text-sm text-[#475569]">Featured product</p>
                        <h2 className="mt-2 text-2xl font-bold text-[#111827]">Nova Sound</h2>
                        <div className="mt-3 flex items-center justify-between text-sm text-[#475569]">
                          <span>Noise canceling</span>
                          <span className="font-bold text-[#b45309]">₹1899</span>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-[#dfe7f0] bg-white p-4">
                        <div className="flex items-center justify-between text-sm text-[#475569]">
                          <span>Deal progress</span>
                          <span className="font-bold text-[#2563eb]">72%</span>
                        </div>
                        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
                          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#2563eb] to-[#f59e0b]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {stats.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-[#dfe7f0] bg-white p-3 text-center">
                        <p className="text-xl font-bold text-[#111827]">{item.value}</p>
                        <p className="mt-1 text-xs text-[#475569]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="offers" className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2563eb]">Deals & picks</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                  Curated for everyday life
                </h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {promoCards.map((card) => (
                <div
                  key={card.title}
                  className={`${card.accent} overflow-hidden rounded-[2rem] border border-[#dfe7f0] p-4 shadow-lg shadow-[#cbd5e1]/40`}
                >
                  <div className="overflow-hidden rounded-[1.4rem] border border-white/70 bg-white p-2">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-52 w-full rounded-[1rem] object-cover"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-[#111827]">{card.title}</h3>
                      <p className="mt-1 text-sm text-[#475569]">Fresh picks for your home</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#b45309] shadow-sm">
                      New
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="mt-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2563eb]">Why choose us</p>
              <h2 className="section-title mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                Everything you need for a better shopping experience
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/50 transition hover:-translate-y-1 hover:border-[#93c5fd]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#f59e0b] text-lg font-bold text-white shadow-lg shadow-[#93c5fd]/30">
                    ✓
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4b5563]">{feature.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="offers" className="mt-20 rounded-[2rem] border border-[#dfe7f0] bg-gradient-to-r from-[#dbeafe] via-[#f8fafc] to-[#fef3c7] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">This week only</p>
                <h2 className="mt-3 text-3xl font-bold text-[#111827] sm:text-4xl">Fresh offers on popular picks</h2>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#111827] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#1f2937]"
              >
                Shop deals
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;