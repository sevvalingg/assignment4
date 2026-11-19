// Şevval Boyraz, 2200004208
// Props and children in TypeScript. Run with `npx tsx ts/props.tsx`.
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

type CardProps = { title: string; children?: ReactNode }

// Worked example: the type goes after the whole pattern, and children is in the type too.
function Card({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>
}
console.log(renderToStaticMarkup(<Card title="Hi">text</Card>))
// <section><h2>Hi</h2>text</section>

// P1 to P7 with my own ferry data:
// ---------------------------------------------------------------------------
// P1: props is ONE object; the type goes after the whole pattern (as in form 11).
type LineCardProps = { line: string; operator?: string; children?: ReactNode }
function LineCard({ line, operator = 'Şehir Hatları', children }: LineCardProps) {
  return <section><h2>{line}</h2><p>{operator}</p>{children}</section>
}
console.log('P1:', renderToStaticMarkup(<LineCard line="Kadıköy-Beşiktaş">Her 30 dakikada bir</LineCard>))

// ---------------------------------------------------------------------------
// P2: children is only a prop, also for the type checker: both forms type-check.
console.log('P2 between tags:', renderToStaticMarkup(<LineCard line="Üsküdar-Eminönü">İlk sefer 07:00</LineCard>))
console.log('P2 as attribute:', renderToStaticMarkup(<LineCard line="Üsküdar-Eminönü" children="İlk sefer 07:00" />))

// ---------------------------------------------------------------------------
// P3: ReactNode is the type of "anything React can render": all of these type-check.
function Box({ children }: { children?: ReactNode }) {
  return <div>[{children}]</div>
}
const nodes: [string, ReactNode][] = [
  ['string', 'Kadıköy'],
  ['number', 0],
  ['element', <b>Eminönü</b>],
  ['null', null],
  ['false', false],
]
for (const [label, node] of nodes) {
  console.log(`P3 ${label}:`, renderToStaticMarkup(<Box>{node}</Box>))
}
// A function is NOT a ReactNode. To accept one, the type must say so (a render prop):
function NextSailing({ children }: { children: (time: string) => ReactNode }) {
  return <p>{children('08:15')}</p>
}
console.log('P3 render prop:', renderToStaticMarkup(<NextSailing>{(time) => `Sonraki vapur ${time}`}</NextSailing>))

// ---------------------------------------------------------------------------
// P4: rest props with types. ComponentProps<'section'> lists every attribute <section> accepts,
// so `rest` can be spread onto <section> safely.
type PierSectionProps = { title: string } & ComponentProps<'section'>
function PierSection({ title, children, ...rest }: PierSectionProps) {
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
console.log('P4:', renderToStaticMarkup(
  <PierSection title="Kadıköy İskelesi" id="kadikoy" className="pier">Beşiktaş, Eminönü, Karaköy</PierSection>,
))
function SpreadThenExplicit({ children, ...rest }: ComponentProps<'section'>) {
  return <section {...rest} className="fixed">{children}</section>
}
console.log('P4 order:', renderToStaticMarkup(<SpreadThenExplicit className="from-parent">x</SpreadThenExplicit>))

// ---------------------------------------------------------------------------
// P5: props or children, typed. Named slots are ReactNode props.
type TimetableProps = { header: ReactNode; footer?: ReactNode; children: ReactNode }
function Timetable({ header, footer = 'Tarife değişebilir', children }: TimetableProps) {
  return <article><header>{header}</header><ul>{children}</ul><footer>{footer}</footer></article>
}
console.log('P5:', renderToStaticMarkup(<Timetable header="Kadıköy-Karaköy-Eminönü"><li>07:30</li><li>08:15</li></Timetable>))

// ---------------------------------------------------------------------------
// P6: defaults, typed. `kind?: string | null`: the default removes undefined, not null,
// so inside the component `kind` has the type `string | null`.
function SailingBadge({ kind = 'normal sefer' }: { kind?: string | null }) {
  const label: string | null = kind
  return <span className="badge">{label}</span>
}
console.log('P6 undefined:', renderToStaticMarkup(<SailingBadge />))
console.log('P6 null:', renderToStaticMarkup(<SailingBadge kind={null} />))

// ---------------------------------------------------------------------------
// P7: three ways to type children and props.

// (a) children?: ReactNode, written by hand. Optional, so <Note /> with nothing inside is fine.
type NoteProps = { pier: string; children?: ReactNode }
function Note({ pier, children }: NoteProps) {
  return <p><b>{pier}:</b> {children}</p>
}
console.log('P7 ReactNode:', renderToStaticMarkup(<Note pier="Beşiktaş">iskele yenileniyor</Note>))
console.log('P7 ReactNode, empty:', renderToStaticMarkup(<Note pier="Beşiktaş" />))
// Rejected: <Note pier="Beşiktaş">{() => 'x'}</Note>
//   error TS2322: Type '() => string' is not assignable to type 'ReactNode'.

// (b) PropsWithChildren<P> adds `children?: ReactNode` to P for you.
type CrossingProps = PropsWithChildren<{ from: string; to: string }>
function Crossing({ from, to, children }: CrossingProps) {
  return <p>{from} → {to} {children}</p>
}
console.log('P7 PropsWithChildren:', renderToStaticMarkup(<Crossing from="Kabataş" to="Kadıköy">(20 dk)</Crossing>))
// Rejected: <Crossing from="Kabataş">x</Crossing>
//   error TS2741: Property 'to' is missing in type '{ children: string; from: string; }' but required in type '{ from: string; to: string; }'.

// (c) ComponentProps<'button'>: every prop a real <button> accepts, plus my own.
type TicketButtonProps = ComponentProps<'button'> & { price: number }
function TicketButton({ price, children, type = 'button', ...rest }: TicketButtonProps) {
  return <button type={type} {...rest}>{children} ({price} TL)</button>
}
console.log('P7 ComponentProps:', renderToStaticMarkup(<TicketButton price={59} disabled aria-label="bilet al">Bilet al</TicketButton>))
// Rejected: <TicketButton price={59} href="/bilet">Bilet al</TicketButton>
//   error TS2322: Type '{ children: string; price: number; href: string; }' is not assignable to type '...'.
//     Property 'href' does not exist on type '...'. Did you mean 'ref'?
// Rejected: <TicketButton>Bilet al</TicketButton>
//   error TS2741: Property 'price' is missing in type '{ children: string; }' but required in type '{ price: number; }'.

