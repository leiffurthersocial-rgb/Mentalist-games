// Text/emoji-based emotion stimuli. No copyrighted image sets — each item is a
// short scenario or described expression the user must classify. The seven
// emotions follow Ekman's commonly-cited basic set.

export const EMOTIONS = [
  'happiness',
  'sadness',
  'fear',
  'anger',
  'surprise',
  'disgust',
  'contempt',
] as const;

export type Emotion = (typeof EMOTIONS)[number];

export const EMOTION_EMOJI: Record<Emotion, string> = {
  happiness: '😀',
  sadness: '😢',
  fear: '😨',
  anger: '😠',
  surprise: '😲',
  disgust: '🤢',
  contempt: '😏',
};

export interface Stimulus {
  /** A described expression or micro-scenario. */
  text: string;
  emotion: Emotion;
  /** One-line tell that reveals why (shown after answering). */
  tell: string;
}

export const STIMULI: Stimulus[] = [
  { text: 'The corners of the mouth pull up, and crow\'s-feet crinkle at the outer eyes.', emotion: 'happiness', tell: 'Genuine (Duchenne) smiles reach the eyes, not just the mouth.' },
  { text: 'Eyebrows drawn up and together, upper eyelids raised, lips stretched horizontally back.', emotion: 'fear', tell: 'Fear pulls the brows up AND together — a distinct combo from surprise.' },
  { text: 'Eyebrows lowered and drawn together, lips pressed thin, chin jutting slightly.', emotion: 'anger', tell: 'A tightened, narrowed brow with pressed lips signals anger.' },
  { text: 'Inner corners of the eyebrows angle upward; the mouth turns down at the corners.', emotion: 'sadness', tell: 'The raised inner brow is hard to fake — a reliable sadness marker.' },
  { text: 'Eyebrows shoot up in smooth arcs, eyes widen, jaw drops open.', emotion: 'surprise', tell: 'Surprise is brief and symmetrical; it fades within a second.' },
  { text: 'The upper lip rises, nose wrinkles, and the person turns slightly away.', emotion: 'disgust', tell: 'A wrinkled nose and raised upper lip is the disgust signature.' },
  { text: 'One corner of the mouth tightens and lifts — an asymmetric half-smile.', emotion: 'contempt', tell: 'Contempt is the only basic emotion shown on just ONE side of the face.' },
  { text: 'A colleague hears their project was cancelled; their shoulders sag and gaze drops to the floor.', emotion: 'sadness', tell: 'Loss and downward gaze read as sadness, not anger.' },
  { text: 'Someone opens a gift, freezes for a split second, eyes wide and mouth agape, before reacting.', emotion: 'surprise', tell: 'The frozen split-second reaction is the surprise tell.' },
  { text: 'A driver is cut off; their jaw clenches, they lean forward and grip the wheel.', emotion: 'anger', tell: 'Forward lean plus muscle tension is approach-oriented anger.' },
  { text: 'A person smells milk that has turned; they recoil, tongue slightly protruding.', emotion: 'disgust', tell: 'Recoil away from a bad smell/taste is disgust.' },
  { text: 'A hiker rounds a bend and sees a snake; they gasp and step back, arms pulling in.', emotion: 'fear', tell: 'Pulling the body inward and backward is a fear/threat response.' },
  { text: 'A friend lands their dream job; they beam, and you notice the crinkle around their eyes.', emotion: 'happiness', tell: 'Eye crinkles confirm the joy is felt, not polite.' },
  { text: 'During a debate, one person glances at their opponent and gives a fleeting one-sided smirk.', emotion: 'contempt', tell: 'A one-sided smirk aimed at another person signals contempt/superiority.' },
  { text: 'Told the deadline just moved up a week, an employee\'s eyes widen and brows fly up momentarily.', emotion: 'surprise', tell: 'The involuntary brow-flash marks genuine surprise at news.' },
  { text: 'A child watches a scary scene; eyes stretched wide, hands creeping up toward the face.', emotion: 'fear', tell: 'Wide eyes plus a protective hand movement is fear.' },
  { text: 'Someone reads a heartfelt message; their lower lip trembles and inner brows lift.', emotion: 'sadness', tell: 'Lip tremble with lifted inner brows is emotional sadness.' },
  { text: 'A patron takes a bite, then their nose scrunches and they push the plate away.', emotion: 'disgust', tell: 'Nose scrunch + pushing away = disgust with taste.' },
  { text: 'Waiting for results, a student\'s teeth clench and their face flushes as they exhale hard.', emotion: 'anger', tell: 'Flush and clenched jaw here read as frustration/anger.' },
  { text: 'Reunited with an old friend at the airport, a traveller\'s whole face lifts and opens.', emotion: 'happiness', tell: 'An open, lifted whole-face expression is joy.' },
  { text: 'Handed a parking ticket, a driver\'s lips press into a thin line and their nostrils flare.', emotion: 'anger', tell: 'Pressed lips and flared nostrils are classic contained anger.' },
  { text: 'A speaker mentions a rival firm; the listener\'s eyes narrow and one lip corner tightens upward.', emotion: 'contempt', tell: 'Eye-narrowing plus a one-sided lip is disdain, not a smile.' },
  { text: 'Shown a photo of an old wound, a viewer\'s upper lip curls and they avert their eyes.', emotion: 'disgust', tell: 'Upper-lip curl with aversion signals revulsion.' },
  { text: 'A performer hears their name called as the winner; their hands fly to their mouth, eyes wet.', emotion: 'happiness', tell: 'Overwhelmed joy can mimic shock, but the wet eyes and open face read positive.' },
  { text: 'Alone at night, someone hears a floorboard creak; they freeze mid-step, breath held.', emotion: 'fear', tell: 'Freezing and breath-holding is the earliest fear response.' },
  { text: 'Told their pet has died, a child\'s face crumples and the inner brows pull sharply up.', emotion: 'sadness', tell: 'The crumpled face with raised inner brows is unmistakable grief.' },
  { text: 'A magician reveals an impossible ending; the crowd\'s brows leap and mouths fall open in unison.', emotion: 'surprise', tell: 'Simultaneous brow-raise and jaw-drop across a crowd is collective surprise.' },
  { text: 'During a tense negotiation, one party leans back, chin raised, and looks down their nose.', emotion: 'contempt', tell: 'Chin-up, looking-down posture broadcasts superiority — contempt.' },
  { text: 'Watching a horror film, a viewer\'s shoulders hunch and they pull a blanket over their chest.', emotion: 'fear', tell: 'Protective hunching and shielding the torso is defensive fear.' },
  { text: 'A diner bites into something rotten; their whole face scrunches toward the centre.', emotion: 'disgust', tell: 'A centripetal face-scrunch is the core disgust display.' },
  { text: 'Getting unexpected good news by phone, a person jumps up, free hand thrown into the air.', emotion: 'happiness', tell: 'Expansive upward movement expresses elation.' },
  { text: 'Accused unfairly in a meeting, someone\'s jaw sets, brows drop, and they lean in sharply.', emotion: 'anger', tell: 'Lowered brows plus a forward lean is confrontational anger.' },
  { text: 'A widow finds an old voicemail from their late partner; their lower lip pushes up and trembles.', emotion: 'sadness', tell: 'The pushed-up, trembling chin is a deep-sadness marker.' },
  { text: 'A prank goes off; the target\'s eyes stretch wide for an instant before they laugh.', emotion: 'surprise', tell: 'The instant of wide eyes before any other reaction is pure surprise.' },
];
