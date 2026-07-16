// Deduction Drills — short inference challenges. Each drill lists clues, a set
// of candidate conclusions (exactly one best-supported), and, for the correct
// conclusion, which clue index is the key evidence. Emphasis: distinguish an
// evidence-backed inference from a plausible-sounding guess.

export interface Drill {
  scene: string;
  clues: string[];
  conclusions: string[];
  /** Index into `conclusions` of the best-supported answer. */
  answer: number;
  /** Index into `clues` of the clue that most directly supports the answer. */
  keyClue: number;
  explanation: string;
}

export const DRILLS: Drill[] = [
  {
    scene: 'A stranger sits down across from you at a café.',
    clues: [
      'Their right shirt cuff is frayed and shiny; the left is not.',
      'There is a faint indentation on the middle finger of their right hand.',
      'They order tea without looking at the menu.',
    ],
    conclusions: [
      'They write by hand a great deal.',
      'They are left-handed.',
      'They are a regular at this café.',
      'They dislike coffee.',
    ],
    answer: 0,
    keyClue: 1,
    explanation:
      'A callus/indentation on the writing finger plus wear on one cuff points to frequent handwriting. Ordering without the menu suggests familiarity but is weaker; nothing indicates left-handedness (the wear is on the right).',
  },
  {
    scene: 'A colleague returns from lunch.',
    clues: [
      'Their shoes are wet only around the soles.',
      'They are carrying a paper bag with a grease spot.',
      'Their umbrella, hooked on their arm, is dry.',
    ],
    conclusions: [
      'It is raining heavily outside.',
      'They walked through recently-washed pavement or puddles, not rain.',
      'They drove to lunch.',
      'They skipped lunch.',
    ],
    answer: 1,
    keyClue: 2,
    explanation:
      'A dry umbrella rules out heavy rain, yet the soles are wet — consistent with puddles or a hosed pavement. The grease bag shows they did eat.',
  },
  {
    scene: 'You meet someone at a conference.',
    clues: [
      'Their badge lanyard is from last year\'s event.',
      'They greet two speakers by first name.',
      'They ask you which sessions are "worth it".',
    ],
    conclusions: [
      'They are a first-time attendee.',
      'They have attended before but don\'t know this year\'s programme.',
      'They are one of the organisers.',
      'They are lost.',
    ],
    answer: 1,
    keyClue: 0,
    explanation:
      'A prior-year lanyard plus knowing speakers indicates a returning attendee; asking what\'s "worth it" shows they haven\'t studied this year\'s schedule. Organisers wouldn\'t ask that.',
  },
  {
    scene: 'A car is parked on your street each morning.',
    clues: [
      'Its windscreen is frost-free while every other car is frosted.',
      'The bonnet is faintly warm to a nearby hand.',
      'A commuter mug sits in the cup holder, steam gone.',
    ],
    conclusions: [
      'The car has been parked overnight.',
      'The car arrived recently, within the last hour.',
      'The car\'s heater was left on all night.',
      'The car belongs to a neighbour.',
    ],
    answer: 1,
    keyClue: 0,
    explanation:
      'No frost while others are frosted, plus residual engine warmth, means the car was driven recently and parked — not sitting overnight.',
  },
  {
    scene: 'A job candidate sits in the waiting room.',
    clues: [
      'They keep straightening an already-straight tie.',
      'Their printed CV has a coffee ring on the corner.',
      'They mouth words silently while looking at a small card.',
    ],
    conclusions: [
      'They are over-qualified and bored.',
      'They are rehearsing prepared answers and are nervous.',
      'They have done this interview before.',
      'They are not really interested in the role.',
    ],
    answer: 1,
    keyClue: 2,
    explanation:
      'Silently rehearsing from a card is direct evidence of preparation under nerves; the fidgeting supports anxiety. Nothing supports over-qualification or disinterest.',
  },
  {
    scene: 'You examine a returned library book.',
    clues: [
      'The spine is barely creased.',
      'A boarding-pass bookmark sits between pages 8 and 9.',
      'The due date was three weeks ago.',
    ],
    conclusions: [
      'The borrower read the whole book.',
      'The borrower barely started it before stopping.',
      'The borrower disliked the ending.',
      'The book was never opened.',
    ],
    answer: 1,
    keyClue: 1,
    explanation:
      'A bookmark near the very start plus an uncreased spine shows reading stalled early. The boarding pass hints travel interrupted them. "Never opened" is contradicted by the bookmark.',
  },
  {
    scene: 'A houseplant sits on a windowsill.',
    clues: [
      'Its leaves all lean toward the room, away from the glass.',
      'The soil is dry and pulling from the pot\'s edge.',
      'A watering can stands empty nearby.',
    ],
    conclusions: [
      'The plant is over-watered.',
      'The plant has been neglected recently.',
      'The plant is a shade species.',
      'The window faces north.',
    ],
    answer: 1,
    keyClue: 1,
    explanation:
      'Soil dry enough to shrink from the pot indicates missed watering; the empty can supports it. Leaning toward light is normal phototropism, not evidence about neglect.',
  },
  {
    scene: 'You watch two people greet at a station.',
    clues: [
      'One carries a single wilting bouquet.',
      'They check the arrivals board repeatedly, then a phone.',
      'They hold a handwritten sign with a name on it.',
    ],
    conclusions: [
      'They are meeting a close family member off a routine commute.',
      'They are meeting someone they have not met in person before.',
      'They work for the railway.',
      'They are seeing someone off, not meeting them.',
    ],
    answer: 1,
    keyClue: 2,
    explanation:
      'A handwritten name-sign is how you meet someone you can\'t recognise by sight — a stranger or infrequent contact. You don\'t hold up a sign for family you know.',
  },
];
