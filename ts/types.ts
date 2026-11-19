// Şevval Boyraz, 2200004208
// What only TypeScript adds (topics T1 to T5). See the handout.

// T1 (worked example): `{ a: string }` inside a pattern is a RENAME, not a type.
const point = { x: 1, y: 2 }
const { x: horizontal } = point // x is renamed to horizontal; there is no variable x
console.log('T1:', horizontal) // T1: 1

// T1 with my own data: the confusion. I wanted "line is a string" and wrote this:
const sailing = { line: 'Kadıköy-Karaköy-Eminönü', departure: '08:15', capacity: 300 }
const { line: string } = sailing
// It compiles, but it made a VARIABLE called `string`. There is no variable `line`.
console.log('T1 (confusion): a variable named string =', string)

// The correct way: the type goes AFTER the whole pattern.
const { departure, capacity }: { departure: string; capacity: number } = sailing
console.log('T1 (correct):', departure, capacity)

// T2: a tuple return type, and what `as const` does.
// The function promises exactly two items: a time and a line.
function nextSailing(): [time: string, line: string] {
  return ['08:15', 'Üsküdar-Eminönü']
}
const [nextTime, nextLine] = nextSailing() // both: string (not undefined, the length is known)
console.log('T2 (tuple):', nextTime, nextLine)

// Without `as const` the array is string[]: items are `string | undefined`, and any string fits.
const plainPair = ['Kadıköy', 'Eminönü']
const [plainFrom] = plainPair // string | undefined
console.log('T2 (no as const):', plainFrom)

// With `as const` it is readonly ['Kadıköy', 'Eminönü']: exact length and exact values.
const fixedPair = ['Kadıköy', 'Eminönü'] as const
const [fixedFrom, fixedTo] = fixedPair // 'Kadıköy' and 'Eminönü', literal types
const homePier: 'Kadıköy' = fixedFrom // only compiles because the type is the literal 'Kadıköy'
console.log('T2 (as const):', homePier, fixedTo)

// T3: noUncheckedIndexedAccess. `const [first] = items` gives `string | undefined`.
const todaysPiers: string[] = ['Beşiktaş', 'Üsküdar']
const [firstPier] = todaysPiers
// firstPier.toUpperCase() would be error TS18048: 'firstPier' is possibly 'undefined'.
// Three ways to deal with it:
if (firstPier !== undefined) {
  console.log('T3 (check):', firstPier.toUpperCase()) // narrowed to string here
}
console.log('T3 (??):', (firstPier ?? 'yok').toUpperCase())
const [pierWithDefault = 'yok'] = todaysPiers // a default removes undefined
console.log('T3 (default):', pierWithDefault.toUpperCase())

// T4: optional fields and defaults change the type of the variable.
type FerryOptions = { express?: boolean; note?: string | null }
const options: FerryOptions = { note: null }
const { express } = options // boolean | undefined
const { express: expressOrFalse = false } = options // boolean: the default removed undefined
const { note = 'not yok' } = options // string | null: a default never removes null
const t4a: boolean | undefined = express
const t4b: boolean = expressOrFalse
const t4c: string | null = note
console.log('T4:', t4a, t4b, t4c)

// T5: a compile error caused by destructuring a field the type does not have.
// The error without the comment line below:
//   error TS2339: Property 'platform' does not exist on type '{ line: string; departure: string; capacity: number; }'.
// @ts-expect-error -- `platform` is not in the type of `sailing`
const { platform } = sailing
console.log('T5 (runs anyway, but):', platform)

// The fix: put the field in the type (optional, because not every sailing has it).
type SailingWithPlatform = { line: string; departure: string; platform?: number }
const withPlatform: SailingWithPlatform = { line: 'Kabataş-Kadıköy', departure: '09:30', platform: 2 }
const { platform: platformNumber = 1 } = withPlatform
console.log('T5 (fix):', platformNumber)
