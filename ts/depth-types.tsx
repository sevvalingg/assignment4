// Şevval Boyraz, 2200004208
// Bonus 2: Depth, type level. Pulling TYPES apart in the same spirit as destructuring values.
// Run with `npx tsx ts/depth-types.tsx`.
import type { ComponentProps, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// ---------------------------------------------------------------------------
// D5: `infer` in tuple types is an array pattern for types.
//   value level:  const [first, ...rest] = line
//   type level:   T extends [infer First, ...infer Rest]
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : undefined
type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : []
type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : undefined

const kadikoyLine = ['Kadıköy', 'Karaköy', 'Eminönü'] as const
type KadikoyLine = typeof kadikoyLine

// These assignments only compile if the computed types are exactly these literals.
const start: First<KadikoyLine> = 'Kadıköy'
const others: Rest<KadikoyLine> = ['Karaköy', 'Eminönü']
const end: Last<KadikoyLine> = 'Eminönü'
console.log('D5 First/Rest/Last:', start, others, end)

// And the value-level pattern gives the same types as the type-level one.
const [startValue, ...othersValue] = kadikoyLine
const sameStart: First<KadikoyLine> = startValue
const sameOthers: Rest<KadikoyLine> = othersValue
console.log('D5 same as the value pattern:', sameStart, sameOthers)

// For a plain string[] there is no "first" known at compile time.
const unknownLength: First<string[]> = undefined
console.log('D5 First<string[]>:', unknownLength)

// ---------------------------------------------------------------------------
// D6: `infer` in object types is an object pattern for types.
//   value level:  const { pier: { name } } = sailing
//   type level:   T extends { pier: { name: infer N } }
type Sailing = { line: string; pier: { name: 'Kadıköy' | 'Beşiktaş'; side: 'Anadolu' | 'Avrupa' } }
type PierNameOf<T> = T extends { pier: { name: infer N } } ? N : never
const pierName: PierNameOf<Sailing> = 'Beşiktaş'
console.log('D6 nested infer:', pierName)

// ---------------------------------------------------------------------------
// D7: Parameters<F> takes a function type apart; [0] is the options object of form 11.
function describeSailing({ line, express = false }: { line: string; express?: boolean }): string {
  return `${line}${express ? ' (ekspres)' : ''}`
}
type DescribeOptions = Parameters<typeof describeSailing>[0]
const opts: DescribeOptions = { line: 'Kadıköy-Beşiktaş', express: true }
console.log('D7 Parameters:', describeSailing(opts))

// The same for a React component: ComponentProps<typeof X> gives its props type.
function PierBadge({ name, side = 'Avrupa' }: { name: string; side?: 'Anadolu' | 'Avrupa' }) {
  return <span>{name} ({side})</span>
}
type PierBadgeProps = ComponentProps<typeof PierBadge>
const badgeProps: PierBadgeProps = { name: 'Üsküdar', side: 'Anadolu' }
console.log('D7 ComponentProps<typeof>:', renderToStaticMarkup(<PierBadge {...badgeProps} />))

// ---------------------------------------------------------------------------
// D8: a generic component. The type of `item` in the render prop is inferred from `items`.
type ListProps<T> = { items: readonly T[]; children: (item: T, index: number) => ReactNode }
function List<T>({ items, children }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{children(item, i)}</li>)}</ul>
}
type Trip = { from: string; to: string; minutes: number }
const trips: Trip[] = [
  { from: 'Kabataş', to: 'Kadıköy', minutes: 20 },
  { from: 'Beşiktaş', to: 'Üsküdar', minutes: 10 },
]
// `{ from, to, minutes }` is form 11 inside the render prop, and its type is Trip, without writing it.
console.log('D8 generic component:', renderToStaticMarkup(
  <List items={trips}>{({ from, to, minutes }) => `${from} → ${to}, ${minutes} dk`}</List>,
))
