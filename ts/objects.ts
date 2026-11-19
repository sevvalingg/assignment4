// Şevval Boyraz, 2200004208
// The same six object forms as js/objects.mjs, now typed.

type Task = { id: string; title: string; status: 'todo' | 'in-progress' | 'done' }

// Form 5 (worked example)
const task: Task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5:', title, status) // form 5: Buy milk todo

// My own types for a ferry sailing.
type Side = 'Avrupa' | 'Anadolu'
type Pier = { name: string; side: Side }
type Sailing = {
  line: string
  departure: string
  operator: string
  pier: Pier
  stops: string[]
  express?: boolean
  capacity?: number
}

// Form 5 with my own data.
const sailing: Sailing = {
  line: 'Kadıköy-Karaköy-Eminönü',
  departure: '08:15',
  operator: 'Şehir Hatları',
  pier: { name: 'Kadıköy', side: 'Anadolu' },
  stops: ['Kadıköy', 'Karaköy', 'Eminönü'],
}
const { line, departure } = sailing // both: string, taken from the Sailing type
console.log('form 5 (ferry):', line, departure)

// Form 6: rename. `line: eveningLine` is a rename, NOT a type annotation (see T1).
// The type goes after the whole pattern.
const { line: eveningLine, departure: eveningTime }: { line: string; departure: string } = {
  line: 'Üsküdar-Eminönü',
  departure: '19:40',
}
console.log('form 6:', eveningLine, eveningTime)

// Form 7: defaults. `express?: boolean` gives `boolean | undefined`;
// with a default the variable is just `boolean`.
const { express = false, capacity = 300 } = sailing
console.log('form 7 (missing):', express, capacity)

const fastSailing: Partial<Sailing> = { line: 'Beşiktaş-Kadıköy', express: true }
const { express: isExpress = false, capacity: seats = 300 } = fastSailing
console.log('form 7 (given):', isExpress, seats)

// Form 8: rest. TypeScript works out the type of the rest: Sailing without `operator`.
const { operator, ...sailingInfo } = sailing
type SailingInfo = typeof sailingInfo // same as Omit<Sailing, 'operator'>
const infoCopy: SailingInfo = sailingInfo
console.log('form 8:', operator, Object.keys(infoCopy))

// Form 9: nested patterns. With noUncheckedIndexedAccess the array items are `string | undefined`.
const {
  pier: { name: pierName, side },
  stops: [firstPier, , lastPier],
} = sailing
console.log('form 9:', pierName, side, firstPier ?? '-', lastPier ?? '-')

// Form 9 when the nested object is optional: the default must be a whole Pier.
type NightSailing = { line: string; pier?: Pier }
const nightSailing: NightSailing = { line: 'Kabataş-Kadıköy' }
const { pier: { name: nightPier } = { name: 'bilinmiyor', side: 'Avrupa' } } = nightSailing
console.log('form 9 (no pier):', nightPier)

// Form 10: computed key. From a Record<string, string> the value may be missing,
// so the type is `string | undefined` (noUncheckedIndexedAccess).
const timetable: Record<string, string> = {
  '07:30': 'Kadıköy-Karaköy-Eminönü',
  '08:15': 'Üsküdar-Eminönü',
  '09:00': 'Beşiktaş-Kadıköy',
}
const wanted = '08:15'
const { [wanted]: lineAtTime } = timetable
console.log('form 10:', wanted, lineAtTime ?? 'no sailing')

// With a key from `keyof Sailing`, TypeScript knows which field it is.
const field = 'operator' satisfies keyof Sailing
const { [field]: chosen } = sailing // type: string
console.log('form 10 (field):', field, chosen)
