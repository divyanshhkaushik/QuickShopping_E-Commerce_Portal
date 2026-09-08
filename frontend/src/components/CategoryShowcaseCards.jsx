import { useNavigate } from "react-router-dom";
import cooktop from "../assets/cooktop.jpg";
import kettle1 from "../assets/kettle_1.jpg";
import echo1 from "../assets/echo1.jpg";
import qubo2 from "../assets/qubo1.jpg";
import bag1 from "../assets/bag1.jpg";
import dress2 from "../assets/dress2.jpg";

const categoryCards = [
  {
    id: "home-kitchen",
    label: "Start with 999",
    title: "Home-buys!",
    route: `/category/${encodeURIComponent("Home & Kitchen")}`,
    accent: "from-[#ffd166] via-[#f4a261] to-[#f77f00]",
    badges: ["Kitchen", "Decor"],
    images: [cooktop, kettle1],
  },
  {
    id: "smart-home",
    label: "Voice Control your Smart Home",
    title: "Smart living starts here",
    route: `/category/${encodeURIComponent("Smart Home")}`,
    accent: "from-[#c7d2fe] via-[#93c5fd] to-[#60a5fa]",
    badges: ["Automation", "Security"],
    images: [echo1, qubo2],
  },
  {
    id: "women-fashion",
    label: "Under 569 | Top offers on top styles",
    title: "Freshly styled for you",
    route: `/category/${encodeURIComponent("Women's Fashion")}`,
    accent: "from-[#fbcfe8] via-[#f9a8d4] to-[#f472b6]",
    badges: ["Trends", "Deals"],
    images: [bag1, dress2],
  },
];

function CategoryShowcaseCards() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-5">
        <h2 className="text-2xl font-black tracking-tight text-[#111827] sm:text-3xl">
          Hot Deals
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {categoryCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => navigate(card.route)}
            className="group overflow-hidden rounded-[1.8rem] bg-white text-left shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`bg-gradient-to-r ${card.accent} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#111827]/80">
                    {card.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#111827]">
                    {card.title}
                  </h3>
                </div>

                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#111827]">
                  Shop now
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-5 pb-5 pt-4">
              {card.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#dfe7f0] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-medium text-[#475569]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              {card.images.map((image, idx) => (
                <div
                  key={`${card.id}-photo-${idx}`}
                  className="h-32 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]"
                >
                  <img
                    src={image}
                    alt={`${card.title} ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryShowcaseCards;
