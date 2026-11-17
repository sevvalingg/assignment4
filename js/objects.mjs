// Şevval Boyraz, 2200004208
// Object destructuring (forms 5 to 10). Run with `node js/objects.mjs`.

// Form 5 (worked example): take properties out of an object by name.
const task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5:', title, status) // form 5: Buy milk todo

// Form 5 with my own data: one ferry sailing.
const sailing = {
  line: 'Kadıköy-Karaköy-Eminönü',
  departure: '08:15',
  operator: 'Şehir Hatları',
  pier: { name: 'Kadıköy', side: 'Anadolu' },
  stops: ['Kadıköy', 'Karaköy', 'Eminönü'],
}
const { line, departure } = sailing
console.log('form 5 (ferry):', line, departure)

// Form 6: rename while you take it, { title: heading }
// `line` and `departure` already exist from form 5, so I must rename.
const evening = { line: 'Üsküdar-Eminönü', departure: '19:40' }
const { line: eveningLine, departure: eveningTime } = evening
console.log('form 6:', eveningLine, eveningTime)

// Form 7: default values, { priority = 'normal' }
// Most sailings have no `express` field: then it is a normal (not express) ferry.
const { express = false, capacity = 300 } = sailing
console.log('form 7 (missing):', express, capacity)

const fastSailing = { line: 'Beşiktaş-Kadıköy', express: true, capacity: undefined }
const { express: isExpress = false, capacity: seats = 300 } = fastSailing
console.log('form 7 (given):', isExpress, seats)

// Form 8: rest, { id, ...others }
// Take the operator out, keep everything else together.
const { operator, ...sailingInfo } = sailing
console.log('form 8:', operator)
console.log('form 8 rest:', sailingInfo)

// Form 9: nested patterns, { owner: { name } } and arrays inside objects
const {
  pier: { name: pierName, side },
  stops: [firstPier, , lastPier],
} = sailing
console.log('form 9:', pierName, side, firstPier, lastPier)

// Form 9 when the nested object is missing.
// tahminim: nightPier undefined olur, program devam eder
try {
  const nightSailing = { line: 'Kabataş-Kadıköy' }
  const { pier: { name: nightPier } } = nightSailing
  console.log('form 9 (no pier):', nightPier)
} catch (error) {
  console.log('form 9 (no pier):', error.message)
}

// Form 10: computed key, { [key]: value }
// A small timetable (sample times, not the real schedule): departure time -> line. The time I look for is decided at run time.
const timetable = { '07:30': 'Kadıköy-Karaköy-Eminönü', '08:15': 'Üsküdar-Eminönü', '09:00': 'Beşiktaş-Kadıköy' }
const wanted = '08:15'
const { [wanted]: lineAtTime } = timetable
console.log('form 10:', wanted, lineAtTime)

const field = 'operator'
const { [field]: chosen } = sailing
console.log('form 10 (field):', field, chosen)
