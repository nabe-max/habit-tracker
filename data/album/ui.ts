import type { LocalizedText } from "./locale";

export const albumUi = {
  brandTagline: {
    en: "Your photos, like a real book",
    ja: "写真を本のように残す",
  } satisfies LocalizedText,
  nav: {
    shelf: { en: "Shelf", ja: "本棚" },
  },
  langToggle: {
    en: "English",
    ja: "日本語",
  },
  shelf: {
    newAlbum: { en: "New album", ja: "新しいアルバム" },
    emptyTitle: { en: "Your shelf is empty", ja: "本棚は空です" },
    emptyDesc: {
      en: "Place photos freely and flip through your album like a book.",
      ja: "写真を自由に配置して、本のようにめくれるアルバムを作れます。",
    },
    createFirst: { en: "Create your first album", ja: "最初のアルバムを作る" },
    openBook: { en: "Open book", ja: "本を開く" },
    edit: { en: "Edit", ja: "編集" },
    deleteConfirm: {
      en: 'Delete "{title}"?',
      ja: "「{title}」を削除しますか？",
    },
    deleted: { en: "Album deleted", ja: "アルバムを削除しました" },
  },
  new: {
    headerTitle: { en: "New album", ja: "新しいアルバム" },
    titleLabel: { en: "Album title", ja: "アルバムのタイトル" },
    titlePlaceholder: { en: "e.g. Osaka Trip 2026", ja: "例: 大阪旅行 2026" },
    submit: { en: "Create & edit", ja: "作成して編集へ" },
    defaultTitle: { en: "Untitled album", ja: "無題のアルバム" },
  },
  edit: {
    viewAsBook: { en: "View as book", ja: "本として見る" },
    loading: { en: "Loading...", ja: "読み込み中..." },
  },
  view: {
    edit: { en: "Edit", ja: "編集" },
  },
  editor: {
    addPage: { en: "+ Page", ja: "＋ ページ" },
    addPhoto: { en: "Add photo", ja: "写真を追加" },
    delete: { en: "Delete", ja: "削除" },
    hint: {
      en: "Drag to move · corners to resize · saved on this device only (max 2MB per photo)",
      ja: "ドラッグで移動 · 角をドラッグでサイズ変更 · この端末に保存（1枚2MBまで）",
    },
    photoAdded: { en: "Photo added", ja: "写真を追加しました" },
    addFailed: { en: "Could not add photo", ja: "追加に失敗しました" },
  },
  book: {
    coverHint: {
      en: "Tap or swipe to turn pages",
      ja: "タップまたはスワイプでめくる",
    },
    end: { en: "— end —", ja: "— end —" },
    prev: { en: "Prev", ja: "前へ" },
    next: { en: "Next", ja: "次へ" },
    pageOf: {
      en: "{current} / {total}",
      ja: "{current} / {total}",
    },
  },
  errors: {
    notImage: { en: "Please choose an image file", ja: "画像ファイルを選んでください" },
    tooLarge: {
      en: "Max 2MB per photo (stored on this device)",
      ja: "1枚2MB以内にしてください（端末保存のため）",
    },
    readFailed: { en: "Failed to read image", ja: "画像の読み込みに失敗しました" },
  },
} as const;

export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
}
