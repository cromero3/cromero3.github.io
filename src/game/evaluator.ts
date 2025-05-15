import type { Card } from './deck'

export interface HandResult {
  name: string
  payout: number
}

export const payouts: Record<string, number> = {
  'Royal Flush':      250,
  'Straight Flush':    50,
  'Four of a Kind':    25,
  'Full House':         9,
  'Flush':              6,
  'Straight':           4,
  'Three of a Kind':    3,
  'Two Pair':           2,
  'Jacks or Better':    1,
  'No Pair':            0,
}

const RANK_VALUE: Record<Card['rank'], number> = {
  '2':  2, '3':  3, '4':  4, '5':  5,
  '6':  6, '7':  7, '8':  8, '9':  9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
}

function isSequential(vals: number[]): boolean {
  for (let i = 1; i < vals.length; i++) {
    if (vals[i] !== vals[i - 1] + 1) return false
  }
  return true
}

export function evaluateHand(hand: Card[]): HandResult {
  const values = hand
    .map(c => RANK_VALUE[c.rank])
    .sort((a, b) => a - b)

  const counts: Record<number, number> = {}
  hand.forEach(c => {
    const v = RANK_VALUE[c.rank]
    counts[v] = (counts[v] || 0) + 1
  })

  const dupCounts = Object.values(counts).sort((a, b) => b - a)
  const suits = hand.map(c => c.suit)
  const isFlush = suits.every(s => s === suits[0])
  const wheel = JSON.stringify(values) === JSON.stringify([2,3,4,5,14])
  const isStraight = isSequential(values) || wheel

  let name: string
  if (isStraight && isFlush && Math.max(...values) === 14 && !wheel) {
    name = 'Royal Flush'
  } else if (isStraight && isFlush) {
    name = 'Straight Flush'
  } else if (dupCounts[0] === 4) {
    name = 'Four of a Kind'
  } else if (dupCounts[0] === 3 && dupCounts[1] === 2) {
    name = 'Full House'
  } else if (isFlush) {
    name = 'Flush'
  } else if (isStraight) {
    name = 'Straight'
  } else if (dupCounts[0] === 3) {
    name = 'Three of a Kind'
  } else if (dupCounts[0] === 2 && dupCounts[1] === 2) {
    name = 'Two Pair'
  } else if (dupCounts[0] === 2) {
    const pairRank = Number(
      Object.keys(counts).find(k => counts[+k] === 2)
    )
    name = pairRank >= 11 ? 'Jacks or Better' : 'No Pair'
  } else {
    name = 'No Pair'
  }

  return { name, payout: payouts[name] }
}