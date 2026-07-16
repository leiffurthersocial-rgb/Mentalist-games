// Fermi estimation questions with stable, well-known numeric answers. The user
// gives a 90% confidence interval; the answer either lands inside it or not.

export interface FermiQuestion {
  question: string;
  answer: number;
  unit: string;
  note: string;
}

export const FERMI_QUESTIONS: FermiQuestion[] = [
  { question: 'How tall is the Eiffel Tower (to the tip)?', answer: 330, unit: 'metres', note: 'About 330 m including antennas — roughly an 81-storey building.' },
  { question: 'How many bones are in an adult human body?', answer: 206, unit: 'bones', note: 'Babies are born with ~270; many fuse to 206 in adulthood.' },
  { question: 'What is the speed of light in a vacuum?', answer: 299792, unit: 'km per second', note: 'Exactly 299,792.458 km/s by definition.' },
  { question: 'How many keys are on a standard piano?', answer: 88, unit: 'keys', note: '52 white and 36 black keys.' },
  { question: 'What is the average distance from the Earth to the Moon?', answer: 384400, unit: 'kilometres', note: 'About 384,400 km on average — it varies with the elliptical orbit.' },
  { question: 'How many member states does the United Nations have?', answer: 193, unit: 'countries', note: '193 members as of the 2010s onward.' },
  { question: 'In what year was the first iPhone released?', answer: 2007, unit: 'year', note: 'Announced January, released June 2007.' },
  { question: 'How heavy is an adult blue whale?', answer: 150, unit: 'tonnes', note: 'Roughly 150 tonnes — the largest animal known to have lived.' },
  { question: 'How deep is the Mariana Trench at its deepest?', answer: 10935, unit: 'metres', note: 'The Challenger Deep is about 10,935 m below sea level.' },
  { question: 'How many confirmed elements are in the periodic table?', answer: 118, unit: 'elements', note: '118 confirmed, up to oganesson.' },
  { question: 'How many chromosomes are in a typical human cell?', answer: 46, unit: 'chromosomes', note: '23 pairs.' },
  { question: 'How long is a marathon?', answer: 42, unit: 'kilometres', note: '42.195 km, fixed since the 1908 London Olympics.' },
  { question: 'How old is the universe?', answer: 138, unit: 'hundred-million years (i.e. 13.8 billion)', note: 'About 13.8 billion years.' },
  { question: 'How many hearts does an octopus have?', answer: 3, unit: 'hearts', note: 'Two pump blood to the gills, one to the body.' },
  { question: 'How tall is Mount Everest above sea level?', answer: 8849, unit: 'metres', note: 'Re-measured at 8,848.86 m in 2020.' },
  { question: 'How many people, roughly, live on Earth today?', answer: 8100, unit: 'millions (i.e. 8.1 billion)', note: 'Passed 8 billion in late 2022.' },
  { question: 'What is the boiling point of water at sea level?', answer: 100, unit: 'degrees Celsius', note: '100 °C at standard atmospheric pressure.' },
  { question: 'How many teeth does an adult human have (including wisdom teeth)?', answer: 32, unit: 'teeth', note: '32 including the four wisdom teeth.' },
  { question: 'How fast does a commercial jet typically cruise?', answer: 900, unit: 'km per hour', note: 'Around 880–930 km/h (about Mach 0.78).' },
  { question: 'How many strings are on a standard guitar?', answer: 6, unit: 'strings', note: 'Six on a standard guitar (twelve-string guitars exist too).' },
  { question: 'What is the freezing point of water in Fahrenheit?', answer: 32, unit: 'degrees Fahrenheit', note: '32 °F = 0 °C.' },
  { question: 'How many minutes are in a full week?', answer: 10080, unit: 'minutes', note: '7 × 24 × 60 = 10,080.' },
  { question: 'How many bones does a giraffe have in its neck?', answer: 7, unit: 'vertebrae', note: 'Seven — the same as humans, just much larger.' },
  { question: 'Roughly how many litres of blood are in an average adult?', answer: 5, unit: 'litres', note: 'About 5 litres.' },
];
