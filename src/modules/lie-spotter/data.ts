// Lie Spotter scenarios. Each has a short context and three first-person
// statements; exactly one is deceptive. The "tell" explains the verbal
// statement-analysis cue that gives it away — the point is to learn to weigh
// language cues, not to trust a gut feeling.

export interface LieScenario {
  context: string;
  statements: string[];
  lie: number; // index of the deceptive statement
  tell: string;
}

export const LIE_SCENARIOS: LieScenario[] = [
  {
    context: 'Three coworkers are asked where they were when petty cash went missing.',
    statements: [
      'I was at my desk all afternoon — the door logs will show it.',
      'Honestly, I would never even dream of touching that drawer, I swear on my life.',
      'I took my break around three and came straight back to my desk.',
    ],
    lie: 1,
    tell: 'Piled-on oaths ("honestly", "I swear on my life") and denying an accusation nobody made are classic deception markers — truthful people rarely over-protest.',
  },
  {
    context: 'A teenager explains a dented car to a parent.',
    statements: [
      'A shopping trolley must have rolled into it in the car park.',
      'I parked, went in, bought milk, came out, and drove home like normal.',
      'The vehicle sustained the damage while it was left unattended by the individual.',
    ],
    lie: 2,
    tell: 'Sudden formal, distancing language ("the vehicle", "the individual" instead of "my car", "me") signals someone psychologically stepping back from their own account.',
  },
  {
    context: 'Three job applicants describe why they left their last role.',
    statements: [
      'I left to look for more responsibility after two good years there.',
      'My manager and I disagreed about direction, so we parted ways amicably.',
      'I was, um, sort of let go, but not really fired, more like a mutual kind of thing, you know?',
    ],
    lie: 2,
    tell: 'Excessive hedging and self-correction ("sort of", "not really", "more like", "kind of") often mark a story being softened or reshaped in real time.',
  },
  {
    context: 'A friend explains why they missed your birthday dinner.',
    statements: [
      'My train was cancelled and the next one was over an hour late.',
      'I genuinely, truly, one hundred percent meant to be there, you have to believe me.',
      'By the time I would have arrived, dinner was already finishing.',
    ],
    lie: 1,
    tell: 'Demanding to be believed and stacking intensifiers ("genuinely, truly, one hundred percent") substitutes emotion for verifiable detail.',
  },
  {
    context: 'Three people describe a car they saw leave the scene.',
    statements: [
      'It was a dark blue hatchback, fairly new, with a dented rear bumper.',
      'I did not get a good look, it happened quickly, but it was a small dark car.',
      'It was a navy 2019 five-door with alloy wheels, a roof box, and a faded parking permit.',
    ],
    lie: 2,
    tell: 'Suspiciously precise, rehearsed-sounding detail ("2019 five-door… faded parking permit") can be a sign of a fabricated, over-prepared account.',
  },
  {
    context: 'A student explains a late essay.',
    statements: [
      'My laptop crashed on Sunday night and I lost the last two sections.',
      'I emailed you about it on Monday morning, you can check your inbox.',
      'To be honest with you, I would obviously never just leave it to the last minute.',
    ],
    lie: 2,
    tell: '"To be honest with you" plus a defensive denial of an unstated accusation ("I would never…") often flags the one claim the speaker is least comfortable with.',
  },
  {
    context: 'Three witnesses recall the order of events at a shop.',
    statements: [
      'He walked in, browsed the shelf, then left without buying anything.',
      'She was at the counter first, then he came in behind her.',
      'The other customers — well, some of them — may or may not have seen what happened, possibly.',
    ],
    lie: 2,
    tell: 'Vague non-committal padding ("may or may not", "possibly", "some of them") avoids making any falsifiable claim — a way to seem cooperative while saying nothing.',
  },
  {
    context: 'A partner explains a late night out.',
    statements: [
      'We stayed for one more round after work and I lost track of time.',
      'Nothing happened, why would you even ask, I have nothing to hide at all.',
      'I texted you around ten to say I would be a bit later than planned.',
    ],
    lie: 1,
    tell: 'Answering a question with a counter-question and volunteering "I have nothing to hide" are defensive tells — truthful accounts tend to just give the information.',
  },
  {
    context: 'Three colleagues describe who broke the shared printer.',
    statements: [
      'I used it at nine, it jammed, I cleared the jam, and it worked fine after.',
      'It was working when I sent my report just before lunch.',
      'I wasn\'t even near it, and anyway that printer has always been unreliable, everyone knows that.',
    ],
    lie: 2,
    tell: 'Bundling a denial with a pre-emptive excuse and an appeal to "everyone knows" shifts blame outward before any blame was assigned.',
  },
  {
    context: 'A contractor explains a delayed delivery.',
    statements: [
      'The supplier shipped late, so the materials arrived on Thursday, not Monday.',
      'We started installation the same afternoon they arrived.',
      'As previously stated, the materials were delivered when they were delivered, as expected.',
    ],
    lie: 2,
    tell: 'Empty circular phrasing ("delivered when they were delivered") and stiff formality ("as previously stated") avoid committing to any checkable fact.',
  },
  {
    context: 'Three roommates explain a broken window.',
    statements: [
      'A branch came down in the storm and cracked it around midnight.',
      'I heard the glass and came down to find it already broken.',
      'I was asleep, obviously, so I couldn\'t have seen anything, and I sleep really deeply anyway.',
    ],
    lie: 2,
    tell: 'Over-explaining an alibi ("obviously… couldn\'t have… anyway I sleep deeply") adds unrequested justification — a common sign of a prepared cover.',
  },
  {
    context: 'A driver explains a scratch on a rental car.',
    statements: [
      'It was there when I collected it — I noted it on the form at pickup.',
      'I drove it to the hotel and back and parked in the same garage both times.',
      'I mean, scratches happen, cars get scratched, it\'s just one of those things that happens to cars.',
    ],
    lie: 2,
    tell: 'Generic philosophising ("scratches happen… one of those things") avoids the specific question of how THIS scratch occurred.',
  },
  {
    context: 'Three interns describe who sent the wrong email.',
    statements: [
      'I drafted it, but I asked Sam to review before anything went out.',
      'I was on lunch when it was sent, my calendar shows the block.',
      'I don\'t recall sending it, I don\'t remember doing that, I have no memory of that happening.',
    ],
    lie: 2,
    tell: 'Repeated memory-hedging ("I don\'t recall… don\'t remember… no memory") gives deniable non-answers instead of a straight account.',
  },
  {
    context: 'A neighbour explains a parcel that went missing from your porch.',
    statements: [
      'I saw the courier leave it around two and then I went inside.',
      'When I looked again an hour later it was gone.',
      'Look, I\'m an honest person, ask anyone, I\'m literally the most honest person on this street.',
    ],
    lie: 2,
    tell: 'Advertising your own honesty ("ask anyone, most honest person") is a credibility appeal that replaces actual evidence — genuinely honest people rarely need to.',
  },
];
