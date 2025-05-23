export interface Card { rank: string; suit: string }

/** returns a fresh, 52-card deck */
export function createDeck(): Card[] {
  const suits = ['♠','♥','♦','♣'] as const
  const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'] as const
  return suits.flatMap(suit =>
    ranks.map(rank => ({ suit, rank }))
  )
}

/** Fisher–Yates shuffle */
export function shuffle(deck: Card[]): Card[] {
  const a = deck.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}