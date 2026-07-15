export const cafeInfo = {
  name: "珈琲屋 木漏れ日",
  nameEn: "KOMOREBI COFFEE",
  tagline: "一杯のコーヒーで、日常に小さな幸せを。",
  phone: "052-987-6543",
  email: "hello@komorebi-coffee.example.com",
  address: "愛知県名古屋市中区大須3-12-8",
  hours: {
    weekday: "8:00 - 20:00",
    weekend: "9:00 - 21:00",
    closed: "不定休（Instagramでお知らせ）",
  },
  seats: "店内28席 / テラス8席",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.989!2d136.906!3d35.159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600370c9e2e8e8e9%3A0x1234567890abcdef!2z5aeS6Imy5b2i!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp",
};

export const menuCategories = [
  {
    name: "COFFEE",
    label: "コーヒー",
    items: [
      { name: "ブレンド", price: "¥480", desc: "深煎り・コクあり" },
      { name: "カフェラテ", price: "¥580", desc: "エスプレッソ + スチームミルク" },
      { name: "カプチーノ", price: "¥580", desc: "ふわふわフォーム" },
      { name: "カフェモカ", price: "¥630", desc: "チョコレート入り" },
      { name: "アイスコーヒー", price: "¥520", desc: "水出し抽出" },
    ],
  },
  {
    name: "TEA & OTHER",
    label: "ティー・その他",
    items: [
      { name: "紅茶（ホット/アイス）", price: "¥480", desc: "アールグレイ" },
      { name: "ハーブティー", price: "¥520", desc: "カモミール / ペパーミント" },
      { name: "ホットチョコレート", price: "¥580", desc: "ベルギー産チョコ" },
      { name: "レモネード", price: "¥550", desc: "自家製シロップ" },
    ],
  },
  {
    name: "FOOD",
    label: "フード",
    items: [
      { name: "日替わりサンド", price: "¥780", desc: "11:00〜数量限定" },
      { name: "キッシュ", price: "¥680", desc: "ほうれん草とベーコン" },
      { name: "本日のスープ", price: "¥580", desc: "パン付き" },
    ],
  },
  {
    name: "DESSERT",
    label: "スイーツ",
    items: [
      { name: "チーズケーキ", price: "¥580", desc: "ベイクドタイプ" },
      { name: "ティラミス", price: "¥620", desc: "自家製マスカルポーネ" },
      { name: "スコーン（2個）", price: "¥480", desc: "クロテッドクリーム付き" },
      { name: "本日のケーキ", price: "¥580〜", desc: "シェフおまかせ" },
    ],
  },
];

export const galleryImages = [
  {
    src: "photo-1495474472287-4d71bcdd2085",
    alt: "ラテアート",
  },
  {
    src: "photo-1554118811-1e0d58224f24",
    alt: "カフェ店内",
  },
  {
    src: "photo-1509042239860-f550ce710b93",
    alt: "コーヒーとスイーツ",
  },
  {
    src: "photo-1442512595331-89f0afa14193",
    alt: "テラス席",
  },
  {
    src: "photo-1514434750368-80f75418b786",
    alt: "コーヒー豆",
  },
  {
    src: "photo-1559928718-27564d77f2a3",
    alt: "朝のカフェ",
  },
];

export const storeFeatures = [
  { label: "Wi-Fi", desc: "無料" },
  { label: "電源", desc: "全席利用可" },
  { label: "テラス", desc: "ペット同伴OK" },
  { label: "テイクアウト", desc: "対応" },
];
