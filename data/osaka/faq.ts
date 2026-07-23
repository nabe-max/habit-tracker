import type { OsakaFaqItem } from "./types";

export const OSAKA_FAQ: OsakaFaqItem[] = [
  {
    id: "ic-card",
    category: { en: "Train", ja: "電車" },
    question: {
      en: "How do I buy and use an IC card?",
      ja: "ICカードの買い方・使い方は？",
    },
    steps: {
      en: [
        "At Kansai Airport or major JR stations, find a ticket machine with English.",
        "Buy ICOCA or pick up a pre-ordered Welcome Suica.",
        "Tap in at the gate, tap out when you exit. Top up at machines when balance is low.",
      ],
      ja: [
        "関空または主要 JR 駅で、英語対応の券売機を探す。",
        "ICOCA を購入、または予約した Welcome Suica を受取。",
        "改札でタッチイン・アウト。残高が少なくなったら券売機でチャージ。",
      ],
    },
    phrase: {
      en: "One ICOCA, please.",
      ja: "ICOCAを一枚お願いします",
      romaji: "ICOCA wo ichimai onegaishimasu",
    },
  },
  {
    id: "lost",
    category: { en: "Lost", ja: "迷子" },
    question: {
      en: "I'm lost. What do I do first?",
      ja: "道に迷った。最初に何する？",
    },
    steps: {
      en: [
        "Find the nearest station name on signs — that is your anchor.",
        "Open Google Maps with your hotel pinned, or show your hotel screenshot.",
        "If it's late or you're tired, take a taxi and show the Japanese address.",
      ],
      ja: [
        "看板の最寄り駅名を確認 — ここが目印。",
        "Google マップでホテルをピン、または予約スクショを見せる。",
        "夜遅い・疲れたらタクシーで、日本語住所を見せる。",
      ],
    },
    link: {
      label: { en: "Open Google Maps (Osaka)", ja: "Google マップ（大阪）" },
      href: "https://www.google.com/maps/search/Osaka,+Japan",
    },
  },
  {
    id: "food-allergy",
    category: { en: "Food", ja: "食事" },
    question: {
      en: "How do I say no pork / allergy?",
      ja: "豚抜き・アレルギーはどう伝える？",
    },
    steps: {
      en: [
        "Point at the phrase below — staff often appreciate Japanese on screen.",
        "Keep it simple: one restriction at a time.",
        "Convenience stores (Konbini) label allergens; staff restaurants vary.",
      ],
      ja: [
        "下のフレーズを画面で見せる — 日本語は伝わりやすい。",
        "一度に一つだけ（例：豚のみ）とシンプルに。",
        "コンビニはアレルギー表示あり。飲食店は店による。",
      ],
    },
    phrase: {
      en: "No pork, please. (allergy)",
      ja: "豚肉アレルギーです。入れないでください",
      romaji: "Butaniku arerugii desu. Irenai de kudasai",
    },
  },
  {
    id: "money",
    category: { en: "Money", ja: "お金" },
    question: { en: "Card or cash?", ja: "カード？現金？" },
    steps: {
      en: [
        "Chains, department stores, and many restaurants take credit cards.",
        "Street food, small bars, and some ticket machines may be cash-only.",
        "7-Eleven ATMs often accept foreign cards.",
      ],
      ja: [
        "チェーン店・デパート・多くのレストランはカード可。",
        "屋台・小さなバー・券売機は現金のみも。",
        "セブン ATM は外国カード対応のことが多い。",
      ],
    },
  },
  {
    id: "trash",
    category: { en: "City", ja: "街" },
    question: { en: "Where do I throw away trash?", ja: "ゴミはどこ？" },
    steps: {
      en: [
        "There are few public bins. Carry small trash until your hotel or a konbini.",
        "Separate burnable vs bottles/cans when your hotel asks.",
      ],
      ja: [
        "公園ゴミ箱は少ない。ホテル・コンビニまで持ち帰り。",
        "ホテルで可燃・缶瓶の分別を求められたら従う。",
      ],
    },
  },
  {
    id: "toilet",
    category: { en: "City", ja: "街" },
    question: { en: "Where are toilets?", ja: "トイレはどこ？" },
    steps: {
      en: [
        "Department stores, konbini, and major stations usually have free toilets.",
        "Look for トイレ or WC signs near station concourses.",
      ],
      ja: [
        "デパート・コンビニ・大駅に無料トイレが多い。",
        "駅構内の「トイレ」「WC」表示を探す。",
      ],
    },
  },
  {
    id: "last-train",
    category: { en: "Train", ja: "電車" },
    question: { en: "When is the last train?", ja: "終電は？" },
    steps: {
      en: [
        "Last trains are often around midnight but vary by line and day.",
        "Check Google Maps or the official operator site for your exact route before a late night out.",
        "Dotonbori on weekends is packed — leave a buffer before last train.",
      ],
      ja: [
        "終電は0時前後が多いが路線・曜日で異なる。",
        "夜遊び前に Google マップか公式サイトで自分のルートを確認。",
        "週末の道頓堀は混雑 — 終電に余裕を。",
      ],
    },
    link: {
      label: { en: "Osaka Metro (official)", ja: "大阪メトロ（公式）" },
      href: "https://www.osakametro.co.jp/en/",
    },
  },
  {
    id: "taxi",
    category: { en: "Transport", ja: "移動" },
    question: { en: "How do I take a taxi?", ja: "タクシーの乗り方は？" },
    steps: {
      en: [
        "Use taxi stands at stations or hotels when possible.",
        "Show your hotel address in Japanese.",
        "Many taxis accept cards, but cash is safe to have.",
      ],
      ja: [
        "駅・ホテルのタクシー乗り場を使う。",
        "日本語の住所を見せる。",
        "カード可も多いが現金があると安心。",
      ],
    },
    phrase: {
      en: "To this address, please.",
      ja: "この住所までお願いします",
      romaji: "Kono jusho made onegaishimasu",
    },
  },
  {
    id: "emergency",
    category: { en: "Emergency", ja: "緊急" },
    question: { en: "Emergency numbers", ja: "緊急の電話番号" },
    steps: {
      en: [
        "Police: 110",
        "Fire / Ambulance: 119",
        "Say your location and hotel name. English support varies — show maps if needed.",
      ],
      ja: [
        "警察: 110",
        "火事・救急: 119",
        "場所とホテル名を伝える。英語対応は不定 — 地図を見せる。",
      ],
    },
  },
  {
    id: "dotonbori-scams",
    category: { en: "Safety", ja: "安全" },
    question: {
      en: "Dotonbori tips (avoid stress)",
      ja: "道頓堀のコツ（トラブル回避）",
    },
    steps: {
      en: [
        "Restaurant touts can be pushy — it's OK to say no and walk away.",
        "Check menus with prices before you sit down.",
        "Photos on the canal are best early evening; it gets very crowded after 7pm on weekends.",
      ],
      ja: [
        "店員の声かけは断って OK。",
        "座る前にメニューと価格を確認。",
        "運河の写真は夕方がよい。週末19時以降は超混雑。",
      ],
    },
  },
];
