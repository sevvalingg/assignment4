// Şevval Boyraz, 2200004208
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
import { renderToStaticMarkup } from 'react-dom/server'

// Worked example: props is ONE object; the parameter pattern takes it apart.
// These two components are the same thing written two ways.
function CardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
console.log('A:', renderToStaticMarkup(<CardA title="Hi">text</CardA>))
console.log('B:', renderToStaticMarkup(<CardB title="Hi">text</CardB>))
// A: <section><h2>Hi</h2>text</section>
// B: <section><h2>Hi</h2>text</section>

// ---------------------------------------------------------------------------
// P1: props is ONE object. My own component: a card for one ferry line.
function LineCardA(props) {
  return <section><h2>{props.line}</h2><p>{props.operator}</p>{props.children}</section>
}
// The same with destructuring in the parameter: this is form 11 (a pattern in a
// parameter) using form 5 (properties by name) on the props object.
function LineCardB({ line, operator, children }) {
  return <section><h2>{line}</h2><p>{operator}</p>{children}</section>
}
console.log('P1 A:', renderToStaticMarkup(<LineCardA line="Kadıköy-Beşiktaş" operator="Şehir Hatları">Her 30 dakikada bir</LineCardA>))
console.log('P1 B:', renderToStaticMarkup(<LineCardB line="Kadıköy-Beşiktaş" operator="Şehir Hatları">Her 30 dakikada bir</LineCardB>))

// What the component really receives: print the props object itself.
function ShowProps(props) {
  console.log('P1 props object:', props)
  return null
}
renderToStaticMarkup(<ShowProps line="Kabataş-Kadıköy" express>sabah seferi</ShowProps>)

// ---------------------------------------------------------------------------
// P2: children is only a prop. Content between the tags and a `children` attribute give the same result.
console.log('P2 between tags:', renderToStaticMarkup(<LineCardB line="Üsküdar-Eminönü">İlk sefer 07:00</LineCardB>))
console.log('P2 as attribute:', renderToStaticMarkup(<LineCardB line="Üsküdar-Eminönü" children="İlk sefer 07:00" />))
// Both at the same time: which one wins?
console.log('P2 both:', renderToStaticMarkup(<LineCardB line="Üsküdar-Eminönü" children="attribute">between tags</LineCardB>))

// `key` is not a prop: React takes it away before the component sees props.
function ShowKey(props) {
  return <span>key is {String(props.key)}</span>
}
console.log('P2 key:', renderToStaticMarkup(<ShowKey key="k1" />))

// ---------------------------------------------------------------------------
// P3: what children can be. Each one is rendered inside <div>[ ... ]</div>.
function Box({ children }) {
  return <div>[{children}]</div>
}
const cases = [
  ['string', 'Kadıköy'],
  ['number', 42],
  ['zero', 0],
  ['one element', <b>Eminönü</b>],
  ['several elements', [<b key="1">Beşiktaş</b>, <i key="2">Üsküdar</i>]],
  ['undefined', undefined],
  ['null', null],
  ['false', false],
  ['true', true],
  ['empty string', ''],
]
for (const [label, value] of cases) {
  console.log(`P3 ${label}:`, renderToStaticMarkup(<Box>{value}</Box>))
}
// A function as children: React does not call it, it renders nothing (and warns).
console.log('P3 function:', renderToStaticMarkup(<Box>{() => 'Kabataş'}</Box>))

// A function as children only works if the component CALLS it ("render prop").
function NextSailing({ children }) {
  const time = '08:15'
  return <p>{children(time)}</p>
}
console.log('P3 function, called:', renderToStaticMarkup(<NextSailing>{(time) => `Sonraki vapur ${time}`}</NextSailing>))

// ---------------------------------------------------------------------------
// P4: separate children from the other props, and spread the rest onto a DOM element.
function PierSection({ title, children, ...rest }) {
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
console.log('P4 rest:', renderToStaticMarkup(
  <PierSection title="Kadıköy İskelesi" id="kadikoy" className="pier" data-side="Anadolu">Beşiktaş, Eminönü, Karaköy</PierSection>,
))

// The order decides who wins: the LAST one written wins.
function SpreadThenExplicit({ children, ...rest }) {
  return <section {...rest} className="fixed">{children}</section> // explicit after spread: explicit wins
}
function ExplicitThenSpread({ children, ...rest }) {
  return <section className="fixed" {...rest}>{children}</section> // spread after explicit: spread wins
}
console.log('P4 spread then explicit:', renderToStaticMarkup(<SpreadThenExplicit className="from-parent">x</SpreadThenExplicit>))
console.log('P4 explicit then spread:', renderToStaticMarkup(<ExplicitThenSpread className="from-parent">x</ExplicitThenSpread>))

// Rest with a name that already exists: `title` is taken out, so it is NOT in rest,
// and it does not become an HTML attribute on <section>.
console.log('P4 title not in rest:', renderToStaticMarkup(<PierSection title="Beşiktaş" lang="tr">x</PierSection>))

// ---------------------------------------------------------------------------
// P5: props or children? The same timetable card built twice.
// (a) with header and footer props: the card decides WHERE each part goes.
function TimetableWithProps({ header, footer, children }) {
  return (
    <article>
      <header>{header}</header>
      <ul>{children}</ul>
      <footer>{footer}</footer>
    </article>
  )
}
// (b) with children only: the caller decides everything inside.
function TimetableWithChildren({ children }) {
  return <article>{children}</article>
}
console.log('P5 props:', renderToStaticMarkup(
  <TimetableWithProps header="Kadıköy-Karaköy-Eminönü" footer="Tarife değişebilir">
    <li>07:30</li><li>08:15</li>
  </TimetableWithProps>,
))
console.log('P5 children:', renderToStaticMarkup(
  <TimetableWithChildren>
    <header>Kadıköy-Karaköy-Eminönü</header>
    <ul><li>07:30</li><li>08:15</li></ul>
    <footer>Tarife değişebilir</footer>
  </TimetableWithChildren>,
))

// ---------------------------------------------------------------------------
// P6: a default for a prop (form 7). undefined triggers it, null does not.
function SailingBadge({ kind = 'normal sefer' }) {
  return <span className="badge">{kind}</span>
}
console.log('P6 missing:', renderToStaticMarkup(<SailingBadge />))
console.log('P6 undefined:', renderToStaticMarkup(<SailingBadge kind={undefined} />))
console.log('P6 null:', renderToStaticMarkup(<SailingBadge kind={null} />))
console.log('P6 given:', renderToStaticMarkup(<SailingBadge kind="ekspres" />))

// ---------------------------------------------------------------------------
// Extra: a component that changes its props. In development React freezes the props object.
function ChangesProps(props) {
  try {
    props.line = 'changed'
    return <p>changed: {props.line}</p>
  } catch (error) {
    return <p>{error.constructor.name}: {error.message}</p>
  }
}
console.log('extra change props:', renderToStaticMarkup(<ChangesProps line="Kadıköy-Beşiktaş" />))
