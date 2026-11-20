// Şevval Boyraz, 2200004208
// Bonus 2: Depth. Experiments that go further than the twelve forms. Run with `node js/depth.mjs`.

// ---------------------------------------------------------------------------
// D1: an array pattern works on ANY iterable, not only arrays.

// A string is iterable: by Unicode code points, not by UTF-16 units.
const [k, a, d] = 'Kadıköy'
console.log('D1 string:', k, a, d)

const shipLine = '🚢Kadıköy'
const [ship, firstLetter] = shipLine
console.log('D1 emoji by pattern:', ship, firstLetter)
console.log('D1 emoji by index:', JSON.stringify(shipLine[0]), JSON.stringify(shipLine[1]), '(two halves of one emoji)')

// A Set: duplicates are already gone, so positions are "first unique, second unique".
const [p1, p2, p3] = new Set(['Kadıköy', 'Kadıköy', 'Eminönü'])
console.log('D1 Set:', p1, p2, p3)

// A Map: each item is a [key, value] pair, so patterns can be nested.
const [[firstPier, firstCount]] = new Map([['Kadıköy', 5], ['Beşiktaş', 2]])
console.log('D1 Map first entry:', firstPier, firstCount)

// A generator: shows WHAT the pattern calls, and WHEN it stops.
function* halicPiers() {
  try {
    for (const pier of ['Beşiktaş', 'Kabataş', 'Karaköy', 'Kasımpaşa']) {
      console.log('D1   generator gives:', pier)
      yield pier
    }
    console.log('D1   generator loop ended normally')
  } finally {
    console.log('D1   generator finally block')
  }
}
const [g1, g2] = halicPiers()
console.log('D1 generator result:', g1, g2)

// Rest asks for everything, so the generator runs to the end.
const [, ...afterFirst] = halicPiers()
console.log('D1 generator rest:', afterFirst)

// My own iterable object: the pattern only needs Symbol.iterator.
const timetable = {
  times: ['07:30', '08:15', '09:00'],
  [Symbol.iterator]() {
    let i = 0
    const times = this.times
    return {
      next() {
        console.log('D1   next() call', i + 1)
        return i < times.length ? { value: times[i++], done: false } : { value: undefined, done: true }
      },
    }
  },
}
const [t1] = timetable
console.log('D1 own iterable:', t1)

// A plain object has no Symbol.iterator.
try {
  const [x] = { line: 'Kadıköy-Beşiktaş' }
  console.log(x)
} catch (error) {
  console.log('D1 plain object:', error.constructor.name, '-', error.message)
}

// ---------------------------------------------------------------------------
// D2: order of evaluation of defaults.

function fallbackPier(reason) {
  console.log(`D2   fallbackPier() called (${reason})`)
  return 'Eminönü'
}
// A default is only evaluated when the value is undefined.
const [given = fallbackPier('first pattern')] = ['Kadıköy']
console.log('D2 value given:', given)
const [missing = fallbackPier('second pattern')] = []
console.log('D2 value missing:', missing)

// A default can use an EARLIER variable of the same pattern...
const [from = 'Kadıköy', to = from] = []
console.log('D2 earlier variable:', from, to)

// ...but not a LATER one: it is not initialised yet (temporal dead zone).
try {
  new Function('const [x = y, y = 1] = []; return x')()
} catch (error) {
  console.log('D2 later variable:', error.constructor.name, '-', error.message)
}

// Object patterns read properties left to right; getters show the order.
const watched = {
  get line() { console.log('D2   read line'); return 'Kadıköy-Beşiktaş' },
  get departure() { console.log('D2   read departure'); return '18:10' },
}
const { departure: dep, line: lin } = watched
console.log('D2 getters:', lin, dep)

// ---------------------------------------------------------------------------
// D3: destructuring in other places.

// In catch: take only the fields of the error you need.
try {
  null.line
} catch ({ name, message }) {
  console.log('D3 catch:', name, '|', message)
}

// for...in gives KEYS as strings; a pattern on a string takes its letters.
const counts = { Kadıköy: 5, Beşiktaş: 2 }
for (const [firstChar, secondChar] in counts) {
  console.log('D3 for...in pattern:', firstChar, secondChar)
}
// for...of over entries gives [key, value] pairs, which is what I usually want.
for (const [pier, count] of Object.entries(counts)) {
  console.log('D3 for...of entries:', pier, count)
}

// Assignment targets do not have to be variables: properties and array items work too.
const board = {}
;[board.from, board.to] = ['Kabataş', 'Kadıköy']
console.log('D3 property targets:', board)

const route = ['Eminönü', 'Karaköy', 'Kadıköy']
;[route[0], route[2]] = [route[2], route[0]]
console.log('D3 swap array items:', route)

;({ line: board.line = 'bilinmiyor', operator: board.operator } = { operator: 'Şehir Hatları' })
console.log('D3 object pattern into properties, with default:', board)

// import looks like destructuring but is not: it uses `as`, not `:`, and has no defaults.
// A dynamic import returns a normal object, so there real destructuring works.
const { renderToStaticMarkup: render } = await import('react-dom/server')
console.log('D3 dynamic import + rename:', typeof render)

// ---------------------------------------------------------------------------
// D4: when destructuring makes code worse.
const trip = { sailing: { pier: { name: 'Kadıköy', side: 'Anadolu' }, times: { first: '07:30', last: '23:45' } } }

// Too deep: hard to read, and it throws if any level is missing.
const { sailing: { pier: { name: deepName }, times: { first: deepFirst, last: deepLast } } } = trip
console.log('D4 deep pattern:', deepName, deepFirst, deepLast)

// Refactored: one level per line, with optional chaining where data can be missing.
const { pier, times } = trip.sailing
const pierName = pier?.name ?? 'bilinmiyor'
const { first, last } = times
console.log('D4 refactored:', pierName, first, last)
