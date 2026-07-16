// Cold Reading Studio content. This module teaches the MECHANICS so users can
// recognise them when they're targeted — not to deceive people.

export interface Statement {
  text: string;
  /** true = Barnum / high-probability (applies to almost anyone). */
  barnum: boolean;
  why: string;
}

// A mix of universally-applicable "Barnum" statements and genuinely specific,
// falsifiable claims. Users classify which is which.
export const STATEMENTS: Statement[] = [
  { text: 'At times you are extroverted and sociable, while at other times you are introverted and reserved.', barnum: true, why: 'Covers both poles — true of essentially everyone (a "rainbow ruse").' },
  { text: 'You have a box of old photographs you keep meaning to sort but never do.', barnum: true, why: 'A near-universal specific-sounding guess most people can affirm.' },
  { text: 'You were born in Lisbon and your mother is a cardiologist.', barnum: false, why: 'A precise, checkable claim that is false for almost everyone.' },
  { text: 'You have a scar on your left knee from childhood.', barnum: false, why: 'Specific and falsifiable — plenty of people have no such scar.' },
  { text: 'You have a great deal of unused potential that you have not turned to your advantage.', barnum: true, why: 'Flattering and unfalsifiable — the classic Forer statement.' },
  { text: 'Security is one of your major goals in life.', barnum: true, why: 'Vague and broadly agreeable; applies to most people.' },
  { text: 'Your car failed its inspection last Tuesday.', barnum: false, why: 'A specific, datable event that is false for almost everyone.' },
  { text: 'Sometimes you worry whether you have made the right decision.', barnum: true, why: 'Universal self-doubt — everyone relates to it.' },
  { text: 'You once considered a career in medicine but chose a different path.', barnum: true, why: 'A common life pattern phrased as a personal insight.' },
  { text: 'You drive a red 2014 Honda with a dent in the rear door.', barnum: false, why: 'Highly specific and checkable — almost certainly false.' },
  { text: 'You tend to be critical of yourself.', barnum: true, why: 'Another Forer sentence — nearly everyone agrees.' },
  { text: 'You have recently experienced a change in your sleep or routine.', barnum: true, why: 'Given how common disruption is, this "hits" for most people.' },
  { text: 'Your grandfather served in the navy and had a tattoo of an anchor.', barnum: false, why: 'A precise family detail that is false for the vast majority.' },
  { text: 'You value honesty in others but have been let down by it.', barnum: true, why: 'Emotionally resonant and universally applicable.' },
  { text: 'You are allergic to penicillin.', barnum: false, why: 'A specific medical fact true for only a small fraction of people.' },
  { text: 'There is a name beginning with “J” who has been significant in your life.', barnum: true, why: 'J-names are so common this is a near-guaranteed hit.' },
  { text: 'You keep something that belonged to someone who is no longer around.', barnum: true, why: 'Almost universal, yet it lands as a personal, poignant "hit".' },
  { text: 'You broke your left wrist skiing in 2019.', barnum: false, why: 'A precise, datable injury false for nearly everyone.' },
  { text: 'You sometimes rehearse conversations in your head before having them.', barnum: true, why: 'A near-universal habit dressed up as insight.' },
  { text: 'Your first pet was a black cat named Shadow.', barnum: false, why: 'Specific name, colour, and species — checkable and usually false.' },
  { text: 'You have a good sense of humour, though not everyone sees it.', barnum: true, why: 'Flattering and unfalsifiable — everyone believes this of themselves.' },
  { text: 'There is a decision from your past you occasionally revisit and wonder about.', barnum: true, why: 'Regret and second-guessing are universal.' },
  { text: 'You speak three languages fluently.', barnum: false, why: 'A specific, verifiable skill true for a minority.' },
  { text: 'You present a calm exterior even when you feel anything but inside.', barnum: true, why: 'Nearly everyone identifies with a public/private split.' },
  { text: 'You had exactly £4.37 in your wallet this morning.', barnum: false, why: 'Absurdly specific and false for virtually everyone.' },
  { text: 'Travel — or the idea of it — has been on your mind lately.', barnum: true, why: 'Vague, positive, and true of most people much of the time.' },
  { text: 'You are the eldest of four siblings.', barnum: false, why: 'A specific birth-order/family-size claim, false for most.' },
];

// --- Mode 2: pick the highest-probability "hit" for a target profile --------

export interface ProfileRound {
  profile: string;
  options: { text: string; hitProbability: 'high' | 'medium' | 'low' }[];
  /** Explanation of why the high-probability option is the safe cold-reading pick. */
  lesson: string;
}

export const PROFILE_ROUNDS: ProfileRound[] = [
  {
    profile: 'A woman in her late 60s wearing a well-worn wedding ring, holding a phone with a cracked screen.',
    options: [
      { text: 'You have grandchildren, or children who feel like your whole world.', hitProbability: 'high' },
      { text: 'You recently returned from scuba diving in Belize.', hitProbability: 'low' },
      { text: 'You are secretly training for a marathon.', hitProbability: 'low' },
    ],
    lesson: 'Age + a long-worn ring makes family the highest-probability theme. Cold readers lead with the safest demographic guess and let the subject fill in specifics.',
  },
  {
    profile: 'A man in his 20s in a band T-shirt, ink-stained fingers, tired eyes.',
    options: [
      { text: 'You are working on something creative that you worry isn\'t good enough.', hitProbability: 'high' },
      { text: 'You own three commercial properties.', hitProbability: 'low' },
      { text: 'You just celebrated your 40th wedding anniversary.', hitProbability: 'low' },
    ],
    lesson: 'The cues suggest a young creative. Pairing a likely activity with universal self-doubt (a Barnum hook) makes it feel like insight.',
  },
  {
    profile: 'Someone visiting a psychic after a recent loss, dressed in dark colours, quiet.',
    options: [
      { text: 'There is something left unsaid between you and someone who has passed.', hitProbability: 'high' },
      { text: 'You will win a lottery within the month.', hitProbability: 'low' },
      { text: 'You are planning to emigrate to Australia.', hitProbability: 'medium' },
    ],
    lesson: 'The context (grief) itself is the biggest clue. "Something left unsaid" is emotionally universal after a loss — the cruellest and most reliable cold-reading move.',
  },
  {
    profile: 'A teenager fidgeting, checking their phone constantly, avoiding eye contact.',
    options: [
      { text: 'You care a lot about what a specific group of people think of you.', hitProbability: 'high' },
      { text: 'You have already paid off your mortgage.', hitProbability: 'low' },
      { text: 'You are a retired airline pilot.', hitProbability: 'low' },
    ],
    lesson: 'Adolescent social anxiety is near-universal. The reader states a developmental near-certainty as if it were a personal revelation.',
  },
  {
    profile: 'A man in a crisp new suit checking his watch outside a corporate building, phone buzzing.',
    options: [
      { text: 'You\'re under pressure to prove yourself to someone who outranks you.', hitProbability: 'high' },
      { text: 'You spend your weekends restoring vintage tractors.', hitProbability: 'low' },
      { text: 'You have never used a smartphone.', hitProbability: 'low' },
    ],
    lesson: 'New suit + corporate setting + anxious time-checking reads as early-career pressure. The reader names a workplace near-certainty and lets the target supply the specifics.',
  },
  {
    profile: 'A woman browsing a bookshop\'s self-help section, holding a journal and a coffee.',
    options: [
      { text: 'You\'re in the middle of trying to change a habit or a chapter of your life.', hitProbability: 'high' },
      { text: 'You are a professional deep-sea welder.', hitProbability: 'low' },
      { text: 'You have recently inherited a castle.', hitProbability: 'low' },
    ],
    lesson: 'The section she\'s browsing is the clue. "Changing a chapter" is almost tautologically true of a self-help browser — context does the reading for you.',
  },
  {
    profile: 'An older man at a war-memorial service, medals on his chest, standing very straight.',
    options: [
      { text: 'You carry the memory of people who didn\'t come home with you.', hitProbability: 'high' },
      { text: 'You are training to become a professional gamer.', hitProbability: 'low' },
      { text: 'You have never left your home town.', hitProbability: 'medium' },
    ],
    lesson: 'The setting and medals make loss and comradeship overwhelmingly likely. Emotionally-loaded context gives the reader a near-guaranteed, moving "hit".',
  },
];
