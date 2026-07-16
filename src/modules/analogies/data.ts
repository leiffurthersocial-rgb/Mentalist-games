// Verbal analogy items: "A is to B as C is to ?". The user identifies the
// relationship in the first pair and maps it onto the second. Each item ships
// with four options (one correct) and the relationship it tests.

export interface Analogy {
  a: string;
  b: string;
  c: string;
  answer: string;
  options: string[];
  relation: string;
}

export const ANALOGIES: Analogy[] = [
  { a: 'Hand', b: 'Glove', c: 'Foot', answer: 'Sock', options: ['Sock', 'Shoe', 'Toe', 'Leg'], relation: 'is covered by' },
  { a: 'Puppy', b: 'Dog', c: 'Kitten', answer: 'Cat', options: ['Cat', 'Lion', 'Pet', 'Mouse'], relation: 'young grows into' },
  { a: 'Hot', b: 'Cold', c: 'Up', answer: 'Down', options: ['Down', 'High', 'Tall', 'Over'], relation: 'is the opposite of' },
  { a: 'Author', b: 'Book', c: 'Composer', answer: 'Symphony', options: ['Symphony', 'Piano', 'Orchestra', 'Concert'], relation: 'creates a' },
  { a: 'Brick', b: 'Wall', c: 'Word', answer: 'Sentence', options: ['Sentence', 'Letter', 'Book', 'Speech'], relation: 'is a building block of' },
  { a: 'Doctor', b: 'Hospital', c: 'Teacher', answer: 'School', options: ['School', 'Student', 'Book', 'Lesson'], relation: 'works in a' },
  { a: 'Bird', b: 'Nest', c: 'Bee', answer: 'Hive', options: ['Hive', 'Honey', 'Flower', 'Sting'], relation: 'lives in a' },
  { a: 'Painter', b: 'Brush', c: 'Writer', answer: 'Pen', options: ['Pen', 'Book', 'Paper', 'Word'], relation: 'uses the tool' },
  { a: 'Fish', b: 'School', c: 'Wolf', answer: 'Pack', options: ['Pack', 'Herd', 'Flock', 'Den'], relation: 'group is called a' },
  { a: 'Thermometer', b: 'Temperature', c: 'Clock', answer: 'Time', options: ['Time', 'Hour', 'Wall', 'Alarm'], relation: 'measures' },
  { a: 'Oasis', b: 'Desert', c: 'Island', answer: 'Ocean', options: ['Ocean', 'Beach', 'Sand', 'Palm'], relation: 'is surrounded by' },
  { a: 'Second', b: 'Minute', c: 'Minute', answer: 'Hour', options: ['Hour', 'Day', 'Clock', 'Week'], relation: 'sixty make one' },
  { a: 'Foal', b: 'Horse', c: 'Cub', answer: 'Bear', options: ['Bear', 'Fox', 'Wolf', 'Cave'], relation: 'young grows into' },
  { a: 'Library', b: 'Books', c: 'Gallery', answer: 'Paintings', options: ['Paintings', 'Artists', 'Frames', 'Statues'], relation: 'houses many' },
  { a: 'Sculptor', b: 'Statue', c: 'Baker', answer: 'Bread', options: ['Bread', 'Oven', 'Flour', 'Kitchen'], relation: 'produces a' },
  { a: 'Whisper', b: 'Shout', c: 'Dim', answer: 'Bright', options: ['Bright', 'Dark', 'Light', 'Glow'], relation: 'weak intensity to strong' },
  { a: 'Key', b: 'Lock', c: 'Password', answer: 'Account', options: ['Account', 'Computer', 'Email', 'Screen'], relation: 'grants access to' },
  { a: 'Pen', b: 'Write', c: 'Knife', answer: 'Cut', options: ['Cut', 'Sharp', 'Blade', 'Kitchen'], relation: 'is a tool used to' },
  { a: 'Caterpillar', b: 'Butterfly', c: 'Tadpole', answer: 'Frog', options: ['Frog', 'Fish', 'Toadstool', 'Pond'], relation: 'metamorphoses into' },
  { a: 'Petal', b: 'Flower', c: 'Feather', answer: 'Bird', options: ['Bird', 'Wing', 'Nest', 'Sky'], relation: 'is a part of a' },
];
