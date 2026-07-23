import type { LocalizedText } from "./locale";

export const osakaUi = {
  brandTagline: {
    en: "Travel calm, not confused",
    ja: "迷わず、落ち着いて旅する",
  } satisfies LocalizedText,
  nav: {
    home: { en: "Home", ja: "ホーム" },
    plan: { en: "3-Day Plan", ja: "3日プラン" },
    prep: { en: "Before You Go", ja: "渡航前" },
    help: { en: "Stuck? Help", ja: "困ったとき" },
  },
  langToggle: {
    en: "English",
    ja: "日本語",
  },
  home: {
    badge: {
      en: "🇯🇵 Built in Osaka, Japan · Build in Public",
      ja: "🇯🇵 大阪発 · Build in Public",
    },
    titleBefore: { en: "Osaka without the", ja: "大阪旅行、" },
    titleHighlight: {
      en: '"what do I do now?"',
      ja: "「で、次何する？」",
    },
    titleAfter: { en: "panic.", ja: "パニックから解放。" },
    description: {
      en: "A simple guide for first-time visitors: a ready-made 3-day plan, before-you-go checklist, and help when you are stuck on trains, food, or finding your hotel.",
      ja: "初来日向けのシンプルガイド。3日プラン、渡航前チェックリスト、電車・食事・ホテルで困ったときのヘルプ。",
    },
    ctaPlan: { en: "Start 3-day plan", ja: "3日プランを見る" },
    ctaHelp: { en: "I need help now", ja: "今困ってる" },
    cardPlanTitle: { en: "3-Day Plan", ja: "3日プラン" },
    cardPlanDesc: {
      en: "Namba base · food, castle, local streets",
      ja: "難波泊 · 食・城・ローカル散策",
    },
    cardPrepTitle: { en: "Before You Go", ja: "渡航前" },
    cardPrepDesc: {
      en: "eSIM, IC card, cash, offline maps",
      ja: "eSIM・ICカード・現金・オフラインマップ",
    },
    cardHelpTitle: { en: "Stuck? Help", ja: "困ったとき" },
    cardHelpDesc: {
      en: "Trains, allergies, lost, emergencies",
      ja: "電車・アレルギー・迷子・緊急時",
    },
    footer1: {
      en: "Free MVP · No login · Always double-check trains and hours on official sites.",
      ja: "無料MVP · ログイン不要 · 電車・営業時間は必ず公式で確認してください。",
    },
    footer2: {
      en: "Feedback welcome on X — shipping in public from Japan.",
      ja: "Xでフィードバック歓迎 — 日本から公開開発中。",
    },
  },
  prep: {
    title: { en: "Before you go", ja: "渡航前チェック" },
    introBefore: {
      en: "Tap to check off — saved on this device only. Then start the",
      ja: "タップでチェック — この端末だけに保存。続けて",
    },
    introLink: { en: "3-day plan", ja: "3日プラン" },
    introAfter: { en: ".", ja: "へ。" },
  },
  help: {
    title: { en: "Stuck? Help", ja: "困ったとき" },
    intro: {
      en: "Quick steps and phrases you can show staff. Not legal or medical advice — when in doubt, ask your hotel or call 110/119.",
      ja: "すぐ使える手順と、店員に見せるフレーズ。法律・医療アドバイスではありません。不安ならホテルか 110/119 へ。",
    },
  },
  plan: {
    baseLabel: { en: "Base", ja: "拠点" },
    newHereBefore: { en: "New here?", ja: "はじめて？" },
    prepLink: { en: "Complete the prep checklist", ja: "渡航前チェックを済ませる" },
    newHereAfter: { en: "first.", ja: "のがおすすめ。" },
    dayLabel: { en: "Day", ja: "Day" },
    headsUp: { en: "Heads-up:", ja: "注意:" },
    phraseTitle: { en: "Phrase of the day", ja: "今日のフレーズ" },
    openMaps: { en: "Open in Maps", ja: "Mapsで開く" },
    tip: { en: "Tip:", ja: "ヒント:" },
  },
} as const;
