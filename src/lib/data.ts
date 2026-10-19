// Centralized SAMPLE DATA. All teams, players, games and users are fictional demo identities.
// Replace these objects with an authorized data provider later; the UI reads only these shapes.

export type AttrKey =
  | "shooting"
  | "finishing"
  | "handling"
  | "playmaking"
  | "defense"
  | "rebounding"
  | "athleticism";

export const ATTRIBUTES: { key: AttrKey; label: string }[] = [
  { key: "shooting", label: "Shooting" },
  { key: "finishing", label: "Finishing" },
  { key: "handling", label: "Ball Handling" },
  { key: "playmaking", label: "Playmaking" },
  { key: "defense", label: "Defense" },
  { key: "rebounding", label: "Rebounding" },
  { key: "athleticism", label: "Athleticism" },
];

export type Team = { id: string; name: string; city: string; short: string; color: string };

export const TEAMS: Team[] = [
  { id: "bcd", name: "Beirut Cedars", city: "Beirut", short: "BCD", color: "var(--cedar)" },
  { id: "jnw", name: "Jounieh Waves", city: "Jounieh", short: "JNW", color: "var(--rare)" },
  { id: "trl", name: "Tripoli Lions", city: "Tripoli", short: "TRL", color: "var(--crimson)" },
  { id: "sdm", name: "Sidon Mariners", city: "Sidon", short: "SDM", color: "var(--chart-4)" },
  { id: "zhe", name: "Zahle Eagles", city: "Zahle", short: "ZHE", color: "var(--legendary)" },
  { id: "bbk", name: "Byblos Knights", city: "Byblos", short: "BBK", color: "var(--epic)" },
];
export const teamById = (id: string) => TEAMS.find((t) => t.id === id)!;

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";
export type Position = "PG" | "SG" | "SF" | "PF" | "C";

export type PlayerCard = {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  season: string;
  rarity: Rarity;
  ability: string;
  boost: Partial<Record<AttrKey, number>>;
  number: number;
};

export const CARDS: PlayerCard[] = [
  { id: "c1", name: "Karim Haddad", teamId: "bcd", position: "PG", season: "2026", rarity: "Legendary", number: 7, ability: "Floor General: +8 Playmaking on every possession", boost: { playmaking: 8, handling: 4 } },
  { id: "c2", name: "Elie Mansour", teamId: "bcd", position: "C", season: "2026", rarity: "Epic", number: 33, ability: "Paint Wall: +7 Defense vs Driving", boost: { defense: 7, rebounding: 5 } },
  { id: "c3", name: "Rami Khoury", teamId: "jnw", position: "SG", season: "2026", rarity: "Epic", number: 11, ability: "Deep Range: +7 Shooting on perimeter plays", boost: { shooting: 7 } },
  { id: "c4", name: "Tony Saad", teamId: "jnw", position: "SF", season: "2026", rarity: "Rare", number: 4, ability: "Two-Way Wing: +4 Shooting, +3 Defense", boost: { shooting: 4, defense: 3 } },
  { id: "c5", name: "Fadi Nassar", teamId: "trl", position: "PF", season: "2026", rarity: "Rare", number: 21, ability: "Glass Cleaner: +6 Rebounding", boost: { rebounding: 6 } },
  { id: "c6", name: "Jad Azar", teamId: "trl", position: "PG", season: "2026", rarity: "Common", number: 3, ability: "Quick Hands: +3 Ball Handling", boost: { handling: 3 } },
  { id: "c7", name: "Marc Hayek", teamId: "sdm", position: "SG", season: "2026", rarity: "Rare", number: 9, ability: "Slasher: +5 Finishing on drives", boost: { finishing: 5 } },
  { id: "c8", name: "Ziad Fares", teamId: "sdm", position: "C", season: "2026", rarity: "Common", number: 15, ability: "Rim Runner: +3 Finishing", boost: { finishing: 3 } },
  { id: "c9", name: "Nader Aoun", teamId: "zhe", position: "SF", season: "2026", rarity: "Legendary", number: 23, ability: "Clutch Gene: +6 Athleticism, +4 Finishing", boost: { athleticism: 6, finishing: 4 } },
  { id: "c10", name: "Hadi Rizk", teamId: "zhe", position: "PF", season: "2026", rarity: "Common", number: 30, ability: "Hustle: +3 Rebounding", boost: { rebounding: 3 } },
  { id: "c11", name: "Samir Daher", teamId: "bbk", position: "PG", season: "2026", rarity: "Epic", number: 1, ability: "Pick & Roll Maestro: +6 Playmaking", boost: { playmaking: 6 } },
  { id: "c12", name: "Georges Abi Nader", teamId: "bbk", position: "C", season: "2026", rarity: "Rare", number: 44, ability: "Shot Blocker: +5 Defense", boost: { defense: 5 } },
  { id: "c13", name: "Ali Chamseddine", teamId: "bcd", position: "SF", season: "2026", rarity: "Common", number: 12, ability: "Corner Specialist: +3 Shooting", boost: { shooting: 3 } },
  { id: "c14", name: "Wael Itani", teamId: "trl", position: "SG", season: "2026", rarity: "Epic", number: 8, ability: "Microwave: +6 Shooting, +2 Athleticism", boost: { shooting: 6, athleticism: 2 } },
  { id: "c15", name: "Charbel Younes", teamId: "jnw", position: "C", season: "2026", rarity: "Common", number: 50, ability: "Big Body: +3 Defense", boost: { defense: 3 } },
  { id: "c16", name: "Bassel Karam", teamId: "sdm", position: "PF", season: "2026", rarity: "Legendary", number: 0, ability: "Mismatch Nightmare: +5 Finishing, +5 Rebounding", boost: { finishing: 5, rebounding: 5 } },
];
export const cardById = (id: string) => CARDS.find((c) => c.id === id)!;

export const INITIAL_OWNED = ["c1", "c3", "c4", "c5", "c6", "c7", "c8", "c10", "c13", "c15"];
export const REWARD_CARD_POOL = ["c2", "c11", "c12", "c14", "c9", "c16"];

export type GameStatus = "Upcoming" | "Live Demo" | "Final";
export type Game = {
  id: string;
  homeId: string;
  awayId: string;
  status: GameStatus;
  tipoff: string;
  venue: string;
  homeScore?: number;
  awayScore?: number;
  quarter?: string;
  finalHome: number;
  finalAway: number;
  topScorer: string; // card/player id
  topRebounder: string;
  q1Leader: string; // team id
  stats: { player: string; pts: number; reb: number; ast: number }[];
};

export const GAMES: Game[] = [
  {
    id: "g1", homeId: "bcd", awayId: "jnw", status: "Live Demo", tipoff: "Today · 19:30", venue: "Beirut Arena (sample)",
    homeScore: 58, awayScore: 54, quarter: "Q3 · 04:12", finalHome: 84, finalAway: 79,
    topScorer: "c1", topRebounder: "c2", q1Leader: "jnw",
    stats: [
      { player: "c1", pts: 21, reb: 4, ast: 7 }, { player: "c2", pts: 12, reb: 11, ast: 1 },
      { player: "c3", pts: 18, reb: 3, ast: 2 }, { player: "c4", pts: 10, reb: 6, ast: 3 },
    ],
  },
  {
    id: "g2", homeId: "trl", awayId: "zhe", status: "Upcoming", tipoff: "Fri · 20:00", venue: "Tripoli Hall (sample)",
    finalHome: 76, finalAway: 81, topScorer: "c9", topRebounder: "c5", q1Leader: "zhe",
    stats: [
      { player: "c14", pts: 0, reb: 0, ast: 0 }, { player: "c5", pts: 0, reb: 0, ast: 0 },
      { player: "c9", pts: 0, reb: 0, ast: 0 }, { player: "c10", pts: 0, reb: 0, ast: 0 },
    ],
  },
  {
    id: "g3", homeId: "sdm", awayId: "bbk", status: "Final", tipoff: "Sun · Final", venue: "Sidon Court (sample)",
    homeScore: 88, awayScore: 82, finalHome: 88, finalAway: 82, topScorer: "c16", topRebounder: "c12", q1Leader: "sdm",
    stats: [
      { player: "c16", pts: 26, reb: 10, ast: 2 }, { player: "c7", pts: 17, reb: 3, ast: 4 },
      { player: "c11", pts: 19, reb: 2, ast: 9 }, { player: "c12", pts: 8, reb: 12, ast: 0 },
    ],
  },
];
export const gameById = (id: string) => GAMES.find((g) => g.id === id)!;

export type Challenge = {
  id: string;
  gameId: string;
  type: string;
  question: string;
  options: { id: string; label: string }[];
  answer: string; // resolved from demo final result
  points: 100 | 150;
  lock: string;
  sponsored?: boolean;
  period: "Daily" | "Weekly";
};

export const CHALLENGES: Challenge[] = [
  { id: "ch1", gameId: "g1", type: "Winner", question: "Who wins Beirut Cedars vs Jounieh Waves?", options: [{ id: "bcd", label: "Beirut Cedars" }, { id: "jnw", label: "Jounieh Waves" }], answer: "bcd", points: 100, lock: "Locks at end of Q3", period: "Daily" },
  { id: "ch2", gameId: "g1", type: "Top scorer", question: "Who finishes as the game's top scorer?", options: [{ id: "c1", label: "Karim Haddad" }, { id: "c3", label: "Rami Khoury" }, { id: "c2", label: "Elie Mansour" }], answer: "c1", points: 150, lock: "Locks at end of Q3", sponsored: true, period: "Daily" },
  { id: "ch3", gameId: "g1", type: "Threshold", question: "Will Elie Mansour reach 10+ rebounds?", options: [{ id: "yes", label: "Yes, 10+" }, { id: "no", label: "No, under 10" }], answer: "yes", points: 150, lock: "Locks at end of Q3", period: "Daily" },
  { id: "ch4", gameId: "g2", type: "Q1 leader", question: "Which team leads after the 1st quarter?", options: [{ id: "trl", label: "Tripoli Lions" }, { id: "zhe", label: "Zahle Eagles" }], answer: "zhe", points: 100, lock: "Locks at tip-off", period: "Weekly" },
  { id: "ch5", gameId: "g2", type: "Top rebounder", question: "Who leads the game in rebounds?", options: [{ id: "c5", label: "Fadi Nassar" }, { id: "c10", label: "Hadi Rizk" }], answer: "c5", points: 150, lock: "Locks at tip-off", period: "Weekly" },
];

export type TrainingCategory = {
  id: "offense" | "defense" | "athleticism";
  name: string;
  attrs: AttrKey[];
  cost: number;
  duration: string;
  demoSeconds: number;
  xp: number;
  desc: string;
};

export const TRAINING: TrainingCategory[] = [
  { id: "offense", name: "Offense", attrs: ["shooting", "finishing", "handling", "playmaking"], cost: 30, duration: "4 hours", demoSeconds: 20, xp: 40, desc: "Shooting reps, finishing drills and pick-and-roll reads." },
  { id: "defense", name: "Defense", attrs: ["defense", "rebounding"], cost: 25, duration: "3 hours", demoSeconds: 15, xp: 35, desc: "Closeouts, help rotations and box-outs." },
  { id: "athleticism", name: "Athleticism", attrs: ["athleticism"], cost: 20, duration: "2 hours", demoSeconds: 10, xp: 30, desc: "Plyometrics, conditioning and first-step burst." },
];

export const DIVISIONS = [
  { name: "Rookie", min: 0 },
  { name: "Prospect", min: 1000 },
  { name: "Starter", min: 1200 },
  { name: "All-Star", min: 1400 },
  { name: "Elite", min: 1600 },
];
export const divisionFor = (rating: number) =>
  [...DIVISIONS].reverse().find((d) => rating >= d.min)!.name;

export const OFF_TACTICS = [
  { id: "perimeter", name: "Perimeter Shooting", desc: "Hunt threes. High reward, beaten by pressure on the arc." },
  { id: "driving", name: "Driving", desc: "Attack the rim for 2s. Strong vs perimeter pressure, struggles vs a packed paint." },
  { id: "balanced", name: "Balanced Offense", desc: "Mix of looks. Never countered hard, never a big edge." },
] as const;
export const DEF_TACTICS = [
  { id: "pressure", name: "Perimeter Pressure", desc: "Run shooters off the line. Weak against drives." },
  { id: "paint", name: "Paint Protection", desc: "Wall off the rim. Leaves shooters open." },
  { id: "balanced", name: "Balanced Defense", desc: "Solid everywhere, dominant nowhere." },
] as const;
export type OffTactic = (typeof OFF_TACTICS)[number]["id"];
export type DefTactic = (typeof DEF_TACTICS)[number]["id"];

export type Opponent = {
  id: string; name: string; rating: number; club: string; initials: string;
  attrs: Record<AttrKey, number>; off: OffTactic; def: DefTactic; cards: string[];
};
export const OPPONENTS: Opponent[] = [
  { id: "o1", name: "CedarSniper", rating: 1245, club: "bcd", initials: "CS", attrs: { shooting: 66, finishing: 58, handling: 60, playmaking: 57, defense: 55, rebounding: 52, athleticism: 60 }, off: "perimeter", def: "paint", cards: ["c3", "c13", "c15"] },
  { id: "o2", name: "PaintBeast_LB", rating: 1280, club: "trl", initials: "PB", attrs: { shooting: 52, finishing: 66, handling: 55, playmaking: 54, defense: 64, rebounding: 66, athleticism: 62 }, off: "driving", def: "pressure", cards: ["c5", "c8", "c10"] },
];

export const DEMO_USERS = [
  { name: "CedarSniper", rating: 1245, iq: 71, xp: 5400, club: "bcd" },
  { name: "PaintBeast_LB", rating: 1280, iq: 64, xp: 6100, club: "trl" },
  { name: "ZahleHooper", rating: 1352, iq: 78, xp: 7300, club: "zhe" },
  { name: "Byblos_PG", rating: 1190, iq: 82, xp: 4800, club: "bbk" },
  { name: "MarinerMaya", rating: 1410, iq: 69, xp: 8200, club: "sdm" },
  { name: "WaveRider", rating: 1105, iq: 58, xp: 3600, club: "jnw" },
];

export const CLUB_STANDINGS = [
  { clubId: "bcd", weekly: 48200, season: 612000, fans: 3120 },
  { clubId: "zhe", weekly: 51400, season: 588000, fans: 2870 },
  { clubId: "trl", weekly: 39800, season: 541000, fans: 2640 },
  { clubId: "sdm", weekly: 36100, season: 498000, fans: 2210 },
  { clubId: "jnw", weekly: 33900, season: 455000, fans: 2050 },
  { clubId: "bbk", weekly: 29500, season: 402000, fans: 1780 },
];

export const SQUADS = [
  { id: "s1", name: "Hamra Hoopers", members: 14, clubId: "bcd" },
  { id: "s2", name: "Corniche Crew", members: 9, clubId: "bcd" },
  { id: "s3", name: "Cedar Analytics", members: 21, clubId: "zhe" },
];

export const SPONSOR = { name: "Northwind Energy", tag: "Sample sponsor brand" };

export const PARTNER_PACKAGES = [
  { id: "season", name: "Season Partner", concept: "Presenting partner of the TFG season: branded season hub, season-start and finals moments.", placement: "Home header lockup, season album cover, end-of-season recap.", interaction: "Fans see the brand as they open the app, follow the season and complete season goals.", metrics: ["Season hub views", "Unique participants", "Repeat weekly visits"], value: "Always-on association with Lebanese basketball across the whole season." },
  { id: "iq", name: "Basketball IQ Partner", concept: "Named statistical challenges, e.g. “Top Scorer Challenge presented by …”.", placement: "Challenge card header and settlement screen.", interaction: "Fans answer a basketball question before tip-off and return for the result.", metrics: ["Challenge participation", "Completed engagements", "Return-for-result rate"], value: "Active, repeated engagement tied to every game night." },
  { id: "collection", name: "Collection Partner", concept: "Branded team album or seasonal collection milestone.", placement: "Album cover and milestone reward reveal.", interaction: "Fans collect cards across weeks to complete the sponsored album.", metrics: ["Album starts", "Milestone completions", "Days active"], value: "Long-tail engagement over weeks, not a single impression." },
  { id: "clubwars", name: "Club Wars Partner", concept: "Weekly club competition or fan-participation milestone.", placement: "Club Wars leaderboard and weekly winner banner.", interaction: "Fans earn points for their club; winning club fans unlock an approved reward.", metrics: ["Participating fans by club", "Weekly points contributed", "Squad joins"], value: "Taps directly into club loyalty and community pride." },
  { id: "rewards", name: "Rewards Partner", concept: "Approved merchandise, offers or experiences as participation rewards.", placement: "Rewards hub and reward confirmation.", interaction: "Fans unlock non-cash rewards through missions and milestones.", metrics: ["Reward redemptions", "Unique redeemers", "Offer conversion where measurable"], value: "Measurable bridge from digital engagement to real-world action." },
];
