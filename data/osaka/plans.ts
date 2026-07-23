import type { OsakaPlan } from "./types";

export const OSAKA_PLANS: OsakaPlan[] = [
  {
    slug: "classic-3day",
    name: {
      en: "Classic 3-Day Osaka (Namba base)",
      ja: "定番3日コース（難波泊）",
    },
    tagline: {
      en: "Food, neon, castle, and local neighborhoods — without planning from scratch.",
      ja: "食・ネオン・城・ローカルエリア — ゼロからプランを組まなくていい。",
    },
    baseArea: {
      en: "Namba / Dotonbori area",
      ja: "難波・道頓堀エリア",
    },
    days: [
      {
        day: 1,
        title: { en: "Kuromon & Dotonbori", ja: "黒門・道頓堀" },
        summary: {
          en: "Market lunch, street food, and the famous neon canal walk.",
          ja: "市場ランチ、ストリートフード、ネオン運河散歩。",
        },
        headsUp: {
          en: "Dotonbori gets crowded after 6pm on weekends. Eat an early lunch at Kuromon if you hate lines.",
          ja: "週末18時以降の道頓堀は混雑。行列が嫌なら黒門は早めのランチを。",
        },
        phrase: {
          en: "Table for one, please.",
          ja: "一人です",
          romaji: "Hitori desu",
        },
        spots: [
          {
            time: "10:00",
            title: {
              en: "Kuromon Ichiba Market",
              ja: "黒門市場",
            },
            description: {
              en: "Grab grilled seafood or fruit. Walk the whole market once before you buy.",
              ja: "海鮮焼き・フルーツなど。買う前に一周する。",
            },
            mapsQuery: "Kuromon Ichiba Market Osaka",
            tip: {
              en: "Cash is useful for small stalls.",
              ja: "小さな店舗は現金があると安心。",
            },
          },
          {
            time: "13:00",
            title: {
              en: "Namba Parks / Namba walk",
              ja: "なんばパークス〜難波散策",
            },
            description: {
              en: "Slow walk toward Dotonbori. Rest at a café if it's hot.",
              ja: "道頓堀方面へゆっくり。暑ければカフェで休憩。",
            },
            mapsQuery: "Namba Parks Osaka",
          },
          {
            time: "17:00",
            title: {
              en: "Dotonbori & Glico sign",
              ja: "道頓堀・グリコサイン",
            },
            description: {
              en: "Photos by the canal, takoyaki or okonomiyaki for dinner.",
              ja: "運河で写真、たこ焼き・お好み焼きで夕食。",
            },
            mapsQuery: "Dotonbori Osaka",
            tip: {
              en: "Say no to pushy touts — choose places with visible prices.",
              ja: "強引な誘いは断る — 値段が見える店を選ぶ。",
            },
          },
        ],
      },
      {
        day: 2,
        title: { en: "Castle & Umeda", ja: "大阪城・梅田" },
        summary: {
          en: "Morning history, afternoon city views from Umeda.",
          ja: "午前は歴史、午後は梅田の街ビュー。",
        },
        headsUp: {
          en: "Osaka Castle park is large — wear comfortable shoes. Umeda stations connect underground; follow signs to your line.",
          ja: "大阪城公園は広い — 歩きやすい靴で。梅田は地下で駅がつながる — 路線表示に従う。",
        },
        phrase: {
          en: "Which platform for Osaka Castle?",
          ja: "大阪城は何番線ですか",
          romaji: "Osaka-jo wa nan-bansen desu ka",
        },
        spots: [
          {
            time: "9:30",
            title: { en: "Osaka Castle Park", ja: "大阪城公園" },
            description: {
              en: "Explore the park; go inside the museum if you want the full history ticket.",
              ja: "公園を散策。天守閣まで入るならチケット購入。",
            },
            mapsQuery: "Osaka Castle",
          },
          {
            time: "14:00",
            title: {
              en: "Umeda Sky Building (optional)",
              ja: "梅田スカイビル（任意）",
            },
            description: {
              en: "Paid observation deck — go on a clear day.",
              ja: "有料展望台 — 晴れの日がおすすめ。",
            },
            mapsQuery: "Umeda Sky Building",
          },
          {
            time: "18:00",
            title: {
              en: "Dinner near Osaka Station",
              ja: "大阪駅周辺で夕食",
            },
            description: {
              en: "Department store basement food halls (depachika) are great for samples.",
              ja: "デパ地下で試食も楽しめる。",
            },
            mapsQuery: "Osaka Station City",
          },
        ],
      },
      {
        day: 3,
        title: {
          en: "Shinsekai & local Osaka",
          ja: "新世界・ローカル大阪",
        },
        summary: {
          en: "Retro streets, Tsutenkaku tower area, kushikatsu lunch.",
          ja: "レトロな街、通天閣エリア、串カツランチ。",
        },
        headsUp: {
          en: "Kushikatsu rule: don't double-dip the shared sauce (one stick, one dip).",
          ja: "串カツのルール：ソース二度付け禁止（1串1回）。",
        },
        phrase: {
          en: "No double dipping, noted!",
          ja: "二度付け禁止、了解です",
          romaji: "Nidozuke kinshi, ryokai desu",
        },
        spots: [
          {
            time: "10:00",
            title: { en: "Shinsekai", ja: "新世界" },
            description: {
              en: "Walk the retro neighborhood; casual photo spots.",
              ja: "レトロな町並みを歩く。気軽に写真。",
            },
            mapsQuery: "Shinsekai Osaka",
          },
          {
            time: "12:00",
            title: {
              en: "Tsutenkaku area lunch",
              ja: "通天閣エリアでランチ",
            },
            description: {
              en: "Try kushikatsu at a busy shop with a menu you understand.",
              ja: "メニューが分かる人気店で串カツ。",
            },
            mapsQuery: "Tsutenkaku Osaka",
          },
          {
            time: "15:00",
            title: {
              en: "Tennoji / Abeno Harukas (optional)",
              ja: "天王寺・あべのハルカス（任意）",
            },
            description: {
              en: "Shopping and another view option if you skip Umeda Sky.",
              ja: "梅田スカイをスキップするなら展望・買い物の選択肢。",
            },
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
