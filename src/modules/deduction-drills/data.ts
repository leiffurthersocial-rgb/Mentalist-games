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
  {
    scene: 'A stranger pays for coffee ahead of you.',
    clues: [
      'They pay with a card in a company name, not their own.',
      'Their lanyard is tucked backwards so the badge is hidden.',
      'They order six coffees with detailed, individual customisations.',
    ],
    conclusions: [
      'They own the café.',
      'They are running a coffee errand for a team at work.',
      'They are meeting five friends here.',
      'They are a barista on a break.',
    ],
    answer: 1,
    keyClue: 2,
    explanation:
      'Six customised coffees on a company card is the office coffee-run pattern; the memorised custom orders imply colleagues, not the buyer\'s own drink. A hidden badge is weak on its own.',
  },
  {
    scene: 'You notice a person waiting at a bus stop.',
    clues: [
      'They let the first two buses pass without boarding.',
      'They keep glancing at the café across the street, not the road.',
      'They are holding a single wrapped gift.',
    ],
    conclusions: [
      'They are waiting for a specific person, not a bus.',
      'They can\'t afford the fare.',
      'They are lost and confused about the route.',
      'They are a bus inspector.',
    ],
    answer: 0,
    keyClue: 0,
    explanation:
      'Letting buses pass means they aren\'t there to travel; watching the café (not the road) shows what they\'re actually waiting on. The gift supports meeting someone.',
  },
  {
    scene: 'A parcel is left on a doorstep.',
    clues: [
      'The tape has been slit cleanly and re-pressed.',
      'The declared-value sticker reads far less than the shop\'s price for the item.',
      'The return address is a residential flat, not a business.',
    ],
    conclusions: [
      'It was shipped brand-new from a retailer.',
      'It is a privately-sold, second-hand item that\'s already been opened.',
      'It is empty.',
      'It was delivered to the wrong address.',
    ],
    answer: 1,
    keyClue: 2,
    explanation:
      'A residential return address plus an under-declared value and re-taping all point to a private second-hand sale, not a retail dispatch. Re-pressed tape alone could be inspection.',
  },
  {
    scene: 'A colleague\'s desk after a long weekend.',
    clues: [
      'A plant is wilted and the soil bone-dry.',
      'Their monitor is off but the desk lamp is still on.',
      'A half-written sticky note trails off mid-sentence.',
    ],
    conclusions: [
      'They left in a normal, unhurried way on Friday.',
      'They left abruptly, mid-task, on Friday.',
      'They came in over the weekend.',
      'They have resigned.',
    ],
    answer: 1,
    keyClue: 2,
    explanation:
      'A note abandoned mid-sentence is direct evidence of an interrupted, abrupt exit; the lamp left on supports it. A dry plant only shows time has passed, not how they left.',
  },
  {
    scene: 'Two runners finish a trail race.',
    clues: [
      'One has mud only up the back of their calves; the other, mud up the front of the shins.',
      'The first is barely breathing hard; the second is gasping.',
      'Both have the same finish time.',
    ],
    conclusions: [
      'The gasping runner ran faster for most of the course.',
      'The mud patterns and breathing suggest one ran and one mostly walked, sprinting only the end.',
      'They ran the whole race side by side.',
      'The first runner cheated by taking a shortcut.',
    ],
    answer: 1,
    keyClue: 0,
    explanation:
      'Mud kicked up the back of the calves is a running gait; mud thrown up the front of the shins fits trudging/scrambling. Matching times plus that contrast implies different strategies, not a shortcut.',
  },
  {
    scene: 'You inspect a used paperback bought online.',
    clues: [
      'Only the first thirty pages are dog-eared and cracked.',
      'A pharmacy receipt from another country is tucked at page 31.',
      'The rest of the spine is stiff and unbroken.',
    ],
    conclusions: [
      'The previous owner read it cover to cover.',
      'The previous owner abandoned it early, likely while travelling.',
      'The book was never opened.',
      'The book is a printing error with blank later pages.',
    ],
    answer: 1,
    keyClue: 0,
    explanation:
      'Wear confined to the first thirty pages plus a stiff remaining spine shows reading stopped early; the foreign receipt as a bookmark suggests it happened during travel.',
  },
  {
    scene: 'A shop\'s CCTV shows a quiet aisle.',
    clues: [
      'A customer picks up an item, checks the price, and puts it back facing the wrong way.',
      'They glance at the camera, then at the exit.',
      'They keep one hand in a coat pocket the whole time.',
    ],
    conclusions: [
      'They are a mystery-shopper auditing the store.',
      'Their behaviour is consistent with concealment and intent to shoplift.',
      'They work restocking shelves.',
      'They are simply undecided about buying.',
    ],
    answer: 1,
    keyClue: 2,
    explanation:
      'A permanently hidden hand, camera/exit checks, and disguising which item was disturbed together indicate concealment. Any one alone is weak — the cluster is what supports the inference.',
  },
];
