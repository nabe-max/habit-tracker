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
    name: "River",
    description: "Gentle flowing water",
    src: mixkit(2450),
    accent: "from-cyan-500/20 to-teal-600/20",
  },
  {
    id: "wind",
    name: "Wind",
    description: "Soft breeze through the trees",
    src: mixkit(2658),
    accent: "from-slate-400/20 to-slate-600/20",
  },
  {
    id: "rain",
    name: "Rain",
    description: "Steady rainfall on a quiet night",
    src: mixkit(1247),
    accent: "from-indigo-500/20 to-blue-700/20",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Slow waves on the shore",
    src: mixkit(1189),
    accent: "from-sky-500/20 to-blue-600/20",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Birds and rustling leaves",
    src: mixkit(2454),
    accent: "from-emerald-500/20 to-green-700/20",
  },
  {
    id: "fire",
    name: "Fireplace",
    description: "Crackling fire warmth",
    src: mixkit(1353),
    accent: "from-orange-500/20 to-amber-700/20",
  },
  {
    id: "night",
    name: "Night",
    description: "Calm city ambience under the stars",
    src: mixkit(1251),
    accent: "from-violet-500/20 to-purple-800/20",
  },
];

export const SLEEP_TIMER_OPTIONS = [
  { label: "Off", minutes: 0 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "60 min", minutes: 60 },
  { label: "90 min", minutes: 90 },
] as const;

export function findSleepSound(id: string): SleepSound | undefined {
  return SLEEP_SOUNDS.find((sound) => sound.id === id);
}
