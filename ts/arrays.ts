// Şevval Boyraz, 2200004208
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

// Form 1 (worked example): the return type of the function is a tuple.
function minMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1:', lowest, highest) // form 1: 2 9

// Form 1 with my own data: the tuple return type says "exactly a time and a line".
function nextFerry(): [time: string, line: string] {
  return ['08:15', 'Kadıköy-Karaköy-Eminönü']
}
const [nextTime, nextLine] = nextFerry() // both: string
console.log('form 1 (ferry):', nextTime, nextLine)

// Form 2: skip an item and collect the rest.
// With noUncheckedIndexedAccess, firstStop is `string | undefined`: the array
// could be shorter than the pattern. The rest is always `string[]`.
const halicLine: string[] = ['Beşiktaş', 'Kabataş', 'Karaköy', 'Kasımpaşa', 'Hasköy', 'Sütlüce', 'Eyüp']
const [, firstStop, ...remainingStops] = halicLine
console.log('form 2:', firstStop ?? 'no stop', remainingStops)

// With a tuple type the length is known, so TypeScript knows the item exists.
type ShortLine = [departure: string, arrival: string]
const kabatasLine: ShortLine = ['Kabataş', 'Kadıköy']
const [, kabatasArrival] = kabatasLine // type: string (not undefined)
console.log('form 2 (tuple):', kabatasArrival.toUpperCase())

// Form 3: swap two variables. Both must have the same type, or the swap does not compile.
let departure: string = 'Beşiktaş'
let arrival: string = 'Eyüp'
console.log('form 3 (going):', departure, '->', arrival)
;[departure, arrival] = [arrival, departure]
console.log('form 3 (return):', departure, '->', arrival)

// Form 4: default values. A default removes `undefined` from the type:
// `from` is `string`, not `string | undefined`.
const noPiers: string[] = []
const [from = 'Eminönü', to = 'Kadıköy'] = noPiers
console.log('form 4 (empty):', from, '->', to)

const [from2 = 'Eminönü', to2 = 'Kadıköy'] = ['Beşiktaş']
console.log('form 4 (one given):', from2, '->', to2)

// null is a real value for TypeScript too: the default is not used, and the type keeps `null`.
const withNull: [string | undefined, string | null] = [undefined, null]
const [from3 = 'Eminönü', to3 = 'Kadıköy'] = withNull // to3: string | null
console.log('form 4 (undefined, null):', from3, '->', to3)
