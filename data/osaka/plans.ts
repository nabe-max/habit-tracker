import type { OsakaPlan } from "./types";

export const OSAKA_PLANS: OsakaPlan[] = [
  {
    slug: "classic-3day",
    name: "Classic 3-Day Osaka (Namba base)",
    tagline: "Food, neon, castle, and local neighborhoods — without planning from scratch.",
    baseArea: "Namba / Dotonbori area",
    days: [
      {
        day: 1,
        title: "Kuromon & Dotonbori",
        summary: "Market lunch, street food, and the famous neon canal walk.",
        headsUp:
          "Dotonbori gets crowded after 6pm on weekends. Eat an early lunch at Kuromon if you hate lines.",
        phrase: {
          en: "Table for one, please.",
          ja: "一人です",
          romaji: "Hitori desu",
        },
        spots: [
          {
            time: "10:00",
            title: "Kuromon Ichiba Market",
            description: "Grab grilled seafood or fruit. Walk the whole market once before you buy.",
            mapsQuery: "Kuromon Ichiba Market Osaka",
            tip: "Cash is useful for small stalls.",
          },
          {
            time: "13:00",
            title: "Namba Parks / Namba walk",
            description: "Slow walk toward Dotonbori. Rest at a café if it's hot.",
            mapsQuery: "Namba Parks Osaka",
          },
          {
            time: "17:00",
            title: "Dotonbori & Glico sign",
            description: "Photos by the canal, takoyaki or okonomiyaki for dinner.",
            mapsQuery: "Dotonbori Osaka",
            tip: "Say no to pushy touts — choose places with visible prices.",
          },
        ],
      },
      {
        day: 2,
        title: "Castle & Umeda",
        summary: "Morning history, afternoon city views from Umeda.",
        headsUp:
          "Osaka Castle park is large — wear comfortable shoes. Umeda stations connect underground; follow signs to your line.",
        phrase: {
          en: "Which platform for Osaka Castle?",
          ja: "大阪城は何番線ですか",
          romaji: "Osaka-jo wa nan-bansen desu ka",
        },
        spots: [
          {
            time: "9:30",
            title: "Osaka Castle Park",
            description: "Explore the park; go inside the museum if you want the full history ticket.",
            mapsQuery: "Osaka Castle",
          },
          {
            time: "14:00",
            title: "Umeda Sky Building (optional)",
            description: "Paid observation deck — go on a clear day.",
            mapsQuery: "Umeda Sky Building",
          },
          {
            time: "18:00",
            title: "Dinner near Osaka Station",
            description: "Department store basement food halls (depachika) are great for samples.",
            mapsQuery: "Osaka Station City",
          },
        ],
      },
      {
        day: 3,
        title: "Shinsekai & local Osaka",
        summary: "Retro streets, Tsutenkaku tower area, kushikatsu lunch.",
        headsUp:
          "Kushikatsu rule: don't double-dip the shared sauce (one stick, one dip).",
        phrase: {
          en: "No double dipping, noted!",
          ja: "二度付け禁止、了解です",
          romaji: "Nidozuke kinshi, ryokai desu",
        },
        spots: [
          {
            time: "10:00",
            title: "Shinsekai",
            description: "Walk the retro neighborhood; casual photo spots.",
            mapsQuery: "Shinsekai Osaka",
          },
          {
            time: "12:00",
            title: "Tsutenkaku area lunch",
            description: "Try kushikatsu at a busy shop with a menu you understand.",
            mapsQuery: "Tsutenkaku Osaka",
          },
          {
            time: "15:00",
            title: "Tennoji / Abeno Harukas (optional)",
            description: "Shopping and another view option if you skip Umeda Sky.",
            mapsQuery: "Abeno Harukas",
          },
        ],
      },
    ],
  },
];

export function getOsakaPlan(slug: string): OsakaPlan | undefined {
  return OSAKA_PLANS.find((plan) => plan.slug === slug);
}
