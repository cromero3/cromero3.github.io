export interface Card { rank: string; suit: string }
export function createDeck(): Card[]
export function shuffle(deck: Card[]): Card[]

export interface HandResult { name: string; payout: number }
export function evaluateHand(hand: Card[]): HandResult
export const payouts: Record<string, number>