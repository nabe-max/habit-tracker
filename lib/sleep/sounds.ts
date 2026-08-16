export interface SleepSound {
  id: string;
  name: string;
  description: string;
  src: string;
  accent: string;
}

const mixkit = (id: number) =>
  `https://assets.mixkit.co/active_storage/sfx/${id}/${id}-preview.mp3`;

export const SLEEP_SOUNDS: SleepSound[] = [
  {
    id: "river",
    name: "川",
    description: "やさしく流れる水の音",
    src: mixkit(2450),
    accent: "from-cyan-500/20 to-teal-600/20",
  },
  {
    id: "wind",
    name: "風",
    description: "木々を抜けるそよ風",
    src: mixkit(2658),
    accent: "from-slate-400/20 to-slate-600/20",
  },
  {
    id: "rain",
    name: "雨",
    description: "静かな夜の一定した雨音",
    src: mixkit(1247),
    accent: "from-indigo-500/20 to-blue-700/20",
  },
  {
    id: "ocean",
    name: "海",
    description: "岸辺に打ち寄せる波",
    src: mixkit(1189),
    accent: "from-sky-500/20 to-blue-600/20",
  },
  {
    id: "forest",
    name: "森",
    description: "鳥の声と葉ずれの音",
    src: mixkit(2454),
    accent: "from-emerald-500/20 to-green-700/20",
  },
  {
    id: "fire",
    name: "暖炉",
    description: "パチパチと燃える火の音",
    src: mixkit(1353),
    accent: "from-orange-500/20 to-amber-700/20",
  },
  {
    id: "night",
    name: "夜",
    description: "星の下の静かな街の音",
    src: mixkit(1251),
    accent: "from-violet-500/20 to-purple-800/20",
  },
];

export const SLEEP_TIMER_OPTIONS = [
  { label: "オフ", minutes: 0 },
  { label: "15分", minutes: 15 },
  { label: "30分", minutes: 30 },
  { label: "45分", minutes: 45 },
  { label: "60分", minutes: 60 },
  { label: "90分", minutes: 90 },
] as const;

export function findSleepSound(id: string): SleepSound | undefined {
  return SLEEP_SOUNDS.find((sound) => sound.id === id);
}
