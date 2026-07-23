import type { OsakaFaqItem } from "./types";

export const OSAKA_FAQ: OsakaFaqItem[] = [
  {
    id: "ic-card",
    category: "Train",
    question: "How do I buy and use an IC card?",
    steps: [
      "At Kansai Airport or major JR stations, find a ticket machine with English.",
      "Buy ICOCA or pick up a pre-ordered Welcome Suica.",
      "Tap in at the gate, tap out when you exit. Top up at machines when balance is low.",
    ],
    phrase: {
      en: "One ICOCA, please.",
      ja: "ICOCAを一枚お願いします",
      romaji: "ICOCA wo ichimai onegaishimasu",
    },
  },
  {
    id: "lost",
    category: "Lost",
    question: "I'm lost. What do I do first?",
    steps: [
      "Find the nearest station name on signs — that is your anchor.",
      "Open Google Maps with your hotel pinned, or show your hotel screenshot.",
      "If it's late or you're tired, take a taxi and show the Japanese address.",
    ],
    link: {
      label: "Open Google Maps (Osaka)",
      href: "https://www.google.com/maps/search/Osaka,+Japan",
    },
  },
  {
    id: "food-allergy",
    category: "Food",
    question: "How do I say no pork / allergy?",
    steps: [
      "Point at the phrase below — staff often appreciate Japanese on screen.",
      "Keep it simple: one restriction at a time.",
      "Convenience stores (Konbini) label allergens; staff restaurants vary.",
    ],
    phrase: {
      en: "No pork, please. (allergy)",
      ja: "豚肉アレルギーです。入れないでください",
      romaji: "Butaniku arerugii desu. Irenai de kudasai",
    },
  },
  {
    id: "money",
    category: "Money",
    question: "Card or cash?",
    steps: [
      "Chains, department stores, and many restaurants take credit cards.",
      "Street food, small bars, and some ticket machines may be cash-only.",
      "7-Eleven ATMs often accept foreign cards.",
    ],
  },
  {
    id: "trash",
    category: "City",
    question: "Where do I throw away trash?",
    steps: [
      "There are few public bins. Carry small trash until your hotel or a konbini.",
      "Separate burnable vs bottles/cans when your hotel asks.",
    ],
  },
  {
    id: "toilet",
    category: "City",
    question: "Where are toilets?",
    steps: [
      "Department stores, konbini, and major stations usually have free toilets.",
      "Look for トイレ or WC signs near station concourses.",
    ],
  },
  {
    id: "last-train",
    category: "Train",
    question: "When is the last train?",
    steps: [
      "Last trains are often around midnight but vary by line and day.",
      "Check Google Maps or the official operator site for your exact route before a late night out.",
      "Dotonbori on weekends is packed — leave a buffer before last train.",
    ],
    link: {
      label: "Osaka Metro (official)",
      href: "https://www.osakametro.co.jp/en/",
    },
  },
  {
    id: "taxi",
    category: "Transport",
    question: "How do I take a taxi?",
    steps: [
      "Use taxi stands at stations or hotels when possible.",
      "Show your hotel address in Japanese.",
      "Many taxis accept cards, but cash is safe to have.",
    ],
    phrase: {
      en: "To this address, please.",
      ja: "この住所までお願いします",
      romaji: "Kono jusho made onegaishimasu",
    },
  },
  {
    id: "emergency",
    category: "Emergency",
    question: "Emergency numbers",
    steps: [
      "Police: 110",
      "Fire / Ambulance: 119",
      "Say your location and hotel name. English support varies — show maps if needed.",
    ],
  },
  {
    id: "dotonbori-scams",
    category: "Safety",
    question: "Dotonbori tips (avoid stress)",
    steps: [
      "Restaurant touts can be pushy — it's OK to say no and walk away.",
      "Check menus with prices before you sit down.",
      "Photos on the canal are best early evening; it gets very crowded after 7pm on weekends.",
    ],
  },
];
