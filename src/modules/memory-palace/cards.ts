// Playing-card model for the Memory Palace trainer.

export const SUITS = ['♠', '♥', '♦', '♣'] as const;
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

export type Suit = (typeof SUITS)[number];
export type Rank = (typeof RANKS)[number];

export interface Card {
  rank: Rank;
  suit: Suit;
  id: string; // e.g. "A♠"
}

export function fullDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit, id: `${rank}${suit}` });
    }
  }
  return deck;
}

export function isRed(suit: Suit): boolean {
  return suit === '♥' || suit === '♦';
}

export function shuffleDeck(deck: Card[]): Card[] {
  const out = deck.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
