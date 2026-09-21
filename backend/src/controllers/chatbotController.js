const Groq = require("groq-sdk");

const Product = require("../models/Product");

const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const MAX_PRODUCT_RESULTS = 6;

const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const normalizeText = (value = "") => value.toString().trim().toLowerCase();

const parseJsonObject = (content = "") => {
  const match = content.match(/\{[\s\S]*\}/);

  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[0]);
  } catch (error) {
    return null;
  }
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const extractPriceFilters = (query = "") => {
  const normalizedQuery = query.replace(/,/g, "");
  const betweenMatch = normalizedQuery.match(/(?:between|from)\s*₹?\s*(\d+)\s*(?:and|to)\s*₹?\s*(\d+)/i);

  if (betweenMatch) {
    const minPrice = toNumber(betweenMatch[1]);
    const maxPrice = toNumber(betweenMatch[2]);

    return {
      minPrice,
      maxPrice,
    };
  }

  const underMatch = normalizedQuery.match(/(?:under|below|less than|max(?:imum)? of)\s*₹?\s*(\d+)/i);

  if (underMatch) {
    return {
      minPrice: null,
      maxPrice: toNumber(underMatch[1]),
    };
  }

  const aboveMatch = normalizedQuery.match(/(?:above|over|more than|min(?:imum)? of)\s*₹?\s*(\d+)/i);

  if (aboveMatch) {
    return {
      minPrice: toNumber(aboveMatch[1]),
      maxPrice: null,
    };
  }

  return {
    minPrice: null,
    maxPrice: null,
  };
};

const uniqueStrings = (items = []) => {
  const seen = new Set();

  return items.filter((item) => {
    const normalizedItem = normalizeText(item);

    if (!normalizedItem || seen.has(normalizedItem)) {
      return false;
    }

    seen.add(normalizedItem);
    return true;
  });
};

const extractSearchTerms = (query = "") => {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "any",
    "around",
    "available",
    "best",
    "buy",
    "can",
    "find",
    "for",
    "from",
    "get",
    "i",
    "in",
    "is",
    "me",
    "need",
    "of",
    "on",
    "or",
    "please",
    "product",
    "products",
    "range",
    "show",
    "something",
    "that",
    "the",
    "this",
    "to",
    "under",
    "want",
    "with",
  ]);

  return uniqueStrings(
    query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word))
  );
};

const buildFilterPayload = async (query, categories, brands) => {
  const regexFilters = extractPriceFilters(query);

  if (!groqClient) {
    return {
      intent: "product_search",
      minPrice: regexFilters.minPrice,
      maxPrice: regexFilters.maxPrice,
      categories: [],
      brands: [],
      keywords: extractSearchTerms(query),
    };
  }

  try {
    const completion = await groqClient.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You extract shopping filters from user messages for an ecommerce assistant. Return only valid JSON with keys intent, minPrice, maxPrice, categories, brands, keywords. intent must be product_search or general_help. categories, brands, and keywords must be arrays of strings.",
        },
        {
          role: "user",
          content: JSON.stringify({
            query,
            categories,
            brands,
            fallbackPriceFilters: regexFilters,
          }),
        },
      ],
    });

    const rawContent = completion.choices?.[0]?.message?.content || "";
    const parsedContent = parseJsonObject(rawContent);

    if (!parsedContent) {
      throw new Error("Unable to parse Groq filter response");
    }

    return {
      intent: parsedContent.intent === "general_help" ? "general_help" : "product_search",
      minPrice: toNumber(parsedContent.minPrice) ?? regexFilters.minPrice,
      maxPrice: toNumber(parsedContent.maxPrice) ?? regexFilters.maxPrice,
      categories: uniqueStrings(parsedContent.categories || []),
      brands: uniqueStrings(parsedContent.brands || []),
      keywords: uniqueStrings(parsedContent.keywords || []).length
        ? uniqueStrings(parsedContent.keywords || [])
        : extractSearchTerms(query),
    };
  } catch (error) {
    return {
      intent: "product_search",
      minPrice: regexFilters.minPrice,
      maxPrice: regexFilters.maxPrice,
      categories: [],
      brands: [],
      keywords: extractSearchTerms(query),
    };
  }
};

const matchByList = (value, expectedValues = []) => {
  if (!expectedValues.length) {
    return true;
  }

  const normalizedValue = normalizeText(value);

  return expectedValues.some((expectedValue) => normalizedValue.includes(normalizeText(expectedValue)));
};

const scoreProduct = (product, filters) => {
  let score = 0;
  const haystack = [
    product.productName,
    product.description,
    product.category,
    product.brand,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  filters.keywords.forEach((keyword) => {
    if (haystack.includes(normalizeText(keyword))) {
      score += 3;
    }
  });

  filters.categories.forEach((category) => {
    if (normalizeText(product.category).includes(normalizeText(category))) {
      score += 4;
    }
  });

  filters.brands.forEach((brand) => {
    if (normalizeText(product.brand).includes(normalizeText(brand))) {
      score += 4;
    }
  });

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    score += 2;
  }

  return score;
};

const hasSemanticMatch = (product, filters, fallbackKeywords = []) => {
  const searchableText = [
    product.productName,
    product.description,
    product.category,
    product.brand,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const candidateKeywords = uniqueStrings([...(filters.keywords || []), ...fallbackKeywords]);
  const hasKeywordMatch = candidateKeywords.some((keyword) => searchableText.includes(normalizeText(keyword)));
  const hasCategoryMatch = (filters.categories || []).some((category) =>
    normalizeText(product.category).includes(normalizeText(category))
  );
  const hasBrandMatch = (filters.brands || []).some((brand) =>
    normalizeText(product.brand).includes(normalizeText(brand))
  );

  return hasKeywordMatch || hasCategoryMatch || hasBrandMatch;
};

const filterProducts = (products, filters, fallbackKeywords = []) => {
  const effectiveKeywords = uniqueStrings([...(filters.keywords || []), ...fallbackKeywords]);
  const shouldRequireSemanticMatch =
    effectiveKeywords.length > 0 || (filters.categories || []).length > 0 || (filters.brands || []).length > 0;

  const filteredProducts = products.filter((product) => {
    const isActive = normalizeText(product.status || "active") === "active";
    const matchesCategory = matchByList(product.category, filters.categories);
    const matchesBrand = matchByList(product.brand, filters.brands);
    const matchesMinPrice = filters.minPrice === null || Number(product.price) >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || Number(product.price) <= filters.maxPrice;
    const hasKeywords = !effectiveKeywords.length || effectiveKeywords.some((keyword) => {
      const searchableText = [
        product.productName,
        product.description,
        product.category,
        product.brand,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizeText(keyword));
    });
    const matchesSemanticIntent = !shouldRequireSemanticMatch || hasSemanticMatch(product, filters, fallbackKeywords);

    return isActive && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice && hasKeywords && matchesSemanticIntent;
  });

  return filteredProducts
    .sort((leftProduct, rightProduct) => scoreProduct(rightProduct, filters) - scoreProduct(leftProduct, filters))
    .slice(0, MAX_PRODUCT_RESULTS);
};

const buildFallbackReply = (query, matchedProducts, filters) => {
  if (!matchedProducts.length) {
    return "We don't have that.";
  }

  const priceHint = filters.minPrice !== null || filters.maxPrice !== null
    ? ` within your ${filters.minPrice !== null ? `minimum of Rs. ${filters.minPrice}` : "budget"}${filters.maxPrice !== null ? ` and maximum of Rs. ${filters.maxPrice}` : ""}`
    : "";

  return `I found ${matchedProducts.length} product${matchedProducts.length === 1 ? "" : "s"}${priceHint}. Open any card below to view the full product details.`;
};

const buildAssistantReply = async (query, matchedProducts, filters) => {
  if (!groqClient) {
    return buildFallbackReply(query, matchedProducts, filters);
  }

  try {
    const completion = await groqClient.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are a concise ecommerce shopping assistant. Answer in 2 or 3 short sentences. Mention when relevant that matching products are shown below. Do not invent products that are not provided.",
        },
        {
          role: "user",
          content: JSON.stringify({
            query,
            filters,
            matchedProducts: matchedProducts.map((product) => ({
              productName: product.productName,
              category: product.category,
              brand: product.brand,
              price: product.price,
            })),
          }),
        },
      ],
    });

    return completion.choices?.[0]?.message?.content?.trim() || buildFallbackReply(query, matchedProducts, filters);
  } catch (error) {
    return buildFallbackReply(query, matchedProducts, filters);
  }
};

const sendChatbotMessage = async (req, res) => {
  try {
    const message = req.body?.message?.trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    const categories = uniqueStrings(products.map((product) => product.category));
    const brands = uniqueStrings(products.map((product) => product.brand));
    const filters = await buildFilterPayload(message, categories, brands);
    const fallbackKeywords = extractSearchTerms(message);

    const matchedProducts = filterProducts(products, filters, fallbackKeywords);
    const assistantReply = await buildAssistantReply(message, matchedProducts, filters);
    const greetingPrompts = matchedProducts.length
      ? [
          "Show me trending electronics under Rs. 5000",
          "I need kitchen products between Rs. 1000 and Rs. 3000",
          "Find beauty items from top brands",
        ]
      : [];

    return res.status(200).json({
      success: true,
      assistantReply,
      filters,
      products: matchedProducts,
      greetingPrompts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to process chatbot request",
    });
  }
};

module.exports = {
  sendChatbotMessage,
};