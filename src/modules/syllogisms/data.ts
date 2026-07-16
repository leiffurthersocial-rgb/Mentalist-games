// Logical-validity items. The user judges whether the conclusion FOLLOWS from
// the premises (validity), independent of whether it happens to be TRUE in the
// real world. Several items deliberately pit belief against logic — a valid
// argument with a false-sounding conclusion, or an invalid one whose conclusion
// is actually true — to train resistance to belief bias.

export interface Syllogism {
  premises: [string, string];
  conclusion: string;
  valid: boolean;
  explanation: string;
}

export const SYLLOGISMS: Syllogism[] = [
  {
    premises: ['All mammals are animals.', 'All dogs are mammals.'],
    conclusion: 'Therefore, all dogs are animals.',
    valid: true,
    explanation: 'A classic valid chain: dogs ⊆ mammals ⊆ animals, so dogs ⊆ animals.',
  },
  {
    premises: ['All birds can fly.', 'Penguins are birds.'],
    conclusion: 'Therefore, penguins can fly.',
    valid: true,
    explanation: 'The argument is VALID — the conclusion follows from the premises. It only feels wrong because the first premise is false in reality. Validity is about form, not truth.',
  },
  {
    premises: ['All roses are flowers.', 'Some flowers fade quickly.'],
    conclusion: 'Therefore, some roses fade quickly.',
    valid: false,
    explanation: 'Invalid: the flowers that fade quickly need not be the roses. The two "some/all" groups may not overlap.',
  },
  {
    premises: ['No reptiles are mammals.', 'All snakes are reptiles.'],
    conclusion: 'Therefore, no snakes are mammals.',
    valid: true,
    explanation: 'Valid: snakes are reptiles, and no reptiles are mammals, so no snakes are mammals.',
  },
  {
    premises: ['All athletes are fit.', 'Sam is fit.'],
    conclusion: 'Therefore, Sam is an athlete.',
    valid: false,
    explanation: 'Invalid: being fit does not make someone an athlete — many fit people are not athletes.',
  },
  {
    premises: ['If it rains, the match is cancelled.', 'It rained.'],
    conclusion: 'Therefore, the match was cancelled.',
    valid: true,
    explanation: 'Valid (modus ponens): if P then Q, and P, therefore Q.',
  },
  {
    premises: ['If it rains, the match is cancelled.', 'The match was cancelled.'],
    conclusion: 'Therefore, it rained.',
    valid: false,
    explanation: 'Invalid (affirming the consequent): the match could have been cancelled for another reason.',
  },
  {
    premises: ['If it rains, the match is cancelled.', 'It did not rain.'],
    conclusion: 'Therefore, the match was not cancelled.',
    valid: false,
    explanation: 'Invalid (denying the antecedent): the match might still be cancelled for some other cause.',
  },
  {
    premises: ['All squares are rectangles.', 'All rectangles have four sides.'],
    conclusion: 'Therefore, all squares have four sides.',
    valid: true,
    explanation: 'Valid chain: squares ⊆ rectangles ⊆ four-sided things.',
  },
  {
    premises: ['All cats are animals.', 'All dogs are animals.'],
    conclusion: 'Therefore, all cats are dogs.',
    valid: false,
    explanation: 'Invalid (undistributed middle): sharing the category "animal" does not make cats and dogs the same.',
  },
  {
    premises: ['Some students are tired.', 'All tired people need rest.'],
    conclusion: 'Therefore, some students need rest.',
    valid: true,
    explanation: 'Valid: the tired students are a subset of tired people, all of whom need rest.',
  },
  {
    premises: ['Some doctors are runners.', 'All runners are fit.'],
    conclusion: 'Therefore, all doctors are fit.',
    valid: false,
    explanation: 'Invalid: only SOME doctors were said to be runners, so we can only conclude some doctors are fit — not all.',
  },
  {
    premises: ['If a number is divisible by 10, it is even.', '20 is even.'],
    conclusion: 'Therefore, 20 is divisible by 10.',
    valid: false,
    explanation: 'Invalid (affirming the consequent). The conclusion happens to be TRUE, but it does not follow from these premises — being even does not force divisibility by 10.',
  },
  {
    premises: ['No fish are mammals.', 'All whales are mammals.'],
    conclusion: 'Therefore, no whales are fish.',
    valid: true,
    explanation: 'Valid: whales are mammals, and no mammals are fish, so no whales are fish.',
  },
  {
    premises: ['All heroes are brave.', 'No coward is brave.'],
    conclusion: 'Therefore, no coward is a hero.',
    valid: true,
    explanation: 'Valid: every hero is brave, but no coward is brave, so no coward can be a hero.',
  },
  {
    premises: ['Some metals are liquid at room temperature.', 'All liquids take the shape of their container.'],
    conclusion: 'Therefore, some metals take the shape of their container.',
    valid: true,
    explanation: 'Valid: the metals that are liquid are liquids, and all liquids take their container\'s shape.',
  },
];
