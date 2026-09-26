// ============================================================
// Game configuration: every constant number and every UI word.
// Code identifiers and state IDs stay in English; UI text is Hebrew.
// ============================================================

// ---------- State IDs ----------
export const Position = Object.freeze({
  STANDING: "STANDING",
  ON_BACK: "ON_BACK",
  KNEES: "KNEES",
  MOUNT_CONTROL: "MOUNT_CONTROL",
  SIDE_CONTROL: "SIDE_CONTROL",
  GUARD_CONTROL: "GUARD_CONTROL",
  IN_GUARD: "IN_GUARD",
});

// ---------- Numbers and IDs ----------
export const HAND_SIZE = 5;
export const COPIES_PER_CARD = 8;
export const HUMAN_ID = "P1";
export const COMPUTER_ID = "P2";
export const COMPUTER_DELAY_MS = 1000;

// Game ends when a player reaches this score.
export const WINNING_SCORE = 15;

export const CARD_POINTS = Object.freeze({
  TAKEDOWN: 2,
  MOUNT: 4,
  SIDE_CONTROL: 3,
  ESCAPE_SIDE: 0,
  ESCAPE_MOUNT: 0,
  GUARD: 0,
  GUARD_ESCAPE: 0,
  // Cheaper than a direct Mount (4): the recurring MOUNT_CONTROL_BONUS still
  // applies afterward since the result is the same MOUNT_CONTROL position.
  SWEEP: 2,
});

// Bonus for still holding MOUNT_CONTROL after the opponent's turn ends.
export const MOUNT_CONTROL_BONUS = 4;

// ---------- UI text (Hebrew) ----------
export const POSITION_LABELS = Object.freeze({
  [Position.STANDING]: "על הרגליים",
  [Position.ON_BACK]: "על הגב",
  [Position.KNEES]: "על הברכיים",
  [Position.MOUNT_CONTROL]: "בשליטת מאונט",
  [Position.SIDE_CONTROL]: "בשליטת סייד",
  [Position.GUARD_CONTROL]: "בשליטת גארד",
  [Position.IN_GUARD]: "בתוך גארד",
});

export const CARD_TEXT = Object.freeze({
  TAKEDOWN: { displayName: "הפלה", ruleText: "שניכם עומדים ← היריב על הגב" },
  MOUNT: {
    displayName: "מאונט",
    ruleText: "היריב על הגב, אתה לא על הגב ← שליטת מאונט",
  },
  SIDE_CONTROL: {
    displayName: "סייד",
    ruleText: "היריב על הגב, אתה לא על הגב ← שליטת סייד",
  },
  ESCAPE_SIDE: {
    displayName: "יציאה מסייד",
    ruleText: "אתה על הגב, היריב בשליטת סייד ← שניכם על הברכיים",
  },
  ESCAPE_MOUNT: {
    displayName: "יציאה ממאונט",
    ruleText: "אתה על הגב, היריב בשליטת מאונט ← שניכם על הברכיים",
  },
  GUARD: {
    displayName: "גארד",
    ruleText: "אתה על הגב/על הברכיים, היריב על הברכיים ← אתה בשליטת גארד, היריב בתוך גארד",
  },
  GUARD_ESCAPE: {
    displayName: "יציאה מגארד",
    ruleText: "אתה בתוך גארד, היריב בשליטת גארד ← אתה על הברכיים, היריב על הגב",
  },
  SWEEP: {
    displayName: "סוויפ",
    ruleText: "אתה בשליטת גארד, היריב בתוך גארד ← אתה בשליטת מאונט, היריב על הגב",
  },
});

export const UI_TEXT = Object.freeze({
  pageTitle: "BJJ Card Game",
  gameTitle: "משחק קלפי BJJ",
  humanName: "אתה",
  computerName: "המחשב",
  hiddenCard: "קלף מוסתר",
  newGame: "משחק חדש",
  drawPileLabel: "חפיסת משיכה",
  discardPileLabel: "קלפים שנזרקו",
  pointsToWinLabel: "נקודות לניצחון",
  emptyPile: "ריק",
  score: (points) => `${points} נקודות`,
  turn: {
    computer: "התור של המחשב...",
    humanPlay: "התור שלך: שחק קלף",
    humanDiscard: "התור שלך: אין קלף חוקי, בחר קלף לזרוק",
  },
  gameOver: {
    human: "ניצחת! המשחק נגמר",
    computer: "המחשב ניצח! המשחק נגמר",
  },
  log: {
    humanPlayed: (cardName, points) => `שיחקת: ${cardName} (+${points})`,
    computerPlayed: (cardName, points) => `המחשב שיחק: ${cardName} (+${points})`,
    humanDiscarded: "זרקת קלף והחלפת",
    computerDiscarded: "המחשב זרק קלף והחליף",
    computerNoCards: "למחשב אין קלפים",
    mountBonus: (name, points) => `${name} ממשיך לשלוט במאונט (+${points})`,
  },
});
