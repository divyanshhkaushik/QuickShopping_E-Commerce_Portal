import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const assistantName = "Aira";

const defaultPrompts = [
  "Show me trending electronics under Rs. 5000",
  "I need home and kitchen products between Rs. 1000 and Rs. 3000",
  "Find beauty products from popular brands",
];

const createWelcomeMessage = () => ({
  id: "welcome-message",
  role: "assistant",
  text: `Hi, I'm ${assistantName}, your personalized AI shopping assistant. Ask for products by category, brand, feature, or budget and I will show matching items right here.`,
  prompts: defaultPrompts,
  products: [],
});

function ProductChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([createWelcomeMessage()]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const bottomAnchorRef = useRef(null);

  const visibleMessages = useMemo(() => messages, [messages]);

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  const appendAssistantMessage = (payload) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: payload.assistantReply,
        prompts: payload.greetingPrompts || [],
        products: payload.products || [],
      },
    ]);
    scrollToBottom();
  };

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: trimmedMessage,
        prompts: [],
        products: [],
      },
    ]);
    setInputValue("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await fetch(`${API_URL}/api/chatbot/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to get chatbot response");
      }

      appendAssistantMessage(data);
    } catch (error) {
      appendAssistantMessage({
        assistantReply:
          error.message || "I could not process that request right now. Please try again in a moment.",
        greetingPrompts: defaultPrompts,
        products: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="fixed bottom-6 right-6 z-50 flex min-h-[5.75rem] w-[min(24rem,calc(100vw-2rem))] items-center gap-4 rounded-[2rem] bg-[#0f766e] px-5 py-4 text-left text-white shadow-[0_24px_60px_rgba(15,118,110,0.35)] transition hover:scale-[1.02] hover:bg-[#115e59]"
        aria-label={isOpen ? "Close shopping assistant" : "Open shopping assistant"}
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/14 text-3xl">
          {isOpen ? "×" : "💬"}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-black tracking-wide">Hi, I&apos;m {assistantName}</span>
          <span className="mt-1 block text-xs leading-5 text-white/85">
            Your personalized AI assistant, what help do you need today?
          </span>
        </span>
      </button>

      {isOpen && (
        <aside className="fixed bottom-28 right-4 z-40 flex h-[78vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[2rem] border border-[#d9f0eb] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:right-6 sm:w-[34rem] lg:w-[38vw] lg:min-w-[520px] lg:max-w-[680px]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_55%),linear-gradient(135deg,#0f766e,#134e4a)] px-6 py-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/75">
              QuickShopping Chatbot
            </p>
            <h3 className="mt-2 text-3xl font-black">Meet {assistantName}</h3>
            <p className="mt-2 text-base leading-7 text-white/85">
              Ask for products by category, use case, or price range. I will bring matching products directly from your catalog and help you narrow down the best options.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fffd] px-4 py-4">
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] rounded-3xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "ml-auto bg-[#0f766e] text-white"
                    : "bg-white text-[#0f172a]"
                }`}
              >
                <p className="text-sm leading-6">{message.text}</p>

                {message.prompts?.length > 0 && message.role === "assistant" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="rounded-full border border-[#99f6e4] bg-[#ecfeff] px-3 py-1.5 text-left text-xs font-medium text-[#0f766e] transition hover:border-[#5eead4] hover:bg-[#ccfbf1]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {message.products?.length > 0 && (
                  <div className="mt-4 grid gap-3">
                    {message.products.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="flex items-center gap-3 rounded-2xl border border-[#dbeafe] bg-[#f8fafc] p-2.5 transition hover:-translate-y-0.5 hover:border-[#93c5fd] hover:bg-white"
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.productName}
                          className="h-18 w-18 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-bold text-[#0f172a]">
                            {product.productName}
                          </p>
                          <p className="mt-1 text-xs text-[#475569]">
                            {product.brand || product.category}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-sm font-extrabold text-[#2563eb]">
                              Rs. {product.price}
                            </span>
                            <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#166534]">
                              View
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[92%] rounded-3xl bg-white px-4 py-3 text-sm text-[#334155] shadow-sm">
                Looking through the catalog for the best matches...
              </div>
            )}

            <div ref={bottomAnchorRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(inputValue);
            }}
            className="border-t border-[#d9f0eb] bg-white px-5 py-5"
          >
            <div className="flex items-end gap-3 rounded-[1.6rem] border border-[#cbd5e1] bg-[#f8fafc] p-3 shadow-sm focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#99f6e4]">
              <textarea
                rows={1}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask for products within a budget or category"
                className="max-h-28 min-h-[52px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[#0f172a] outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:bg-[#94a3b8]"
              >
                Send
              </button>
            </div>
          </form>
        </aside>
      )}
    </>
  );
}

export default ProductChatWidget;