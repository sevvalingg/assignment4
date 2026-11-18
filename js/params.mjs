// Şevval Boyraz, 2200004208
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.

// Form 11 (worked example): an options object in the parameter list, with defaults.
function createTask({ title, status = 'todo' } = {}) {
  return { title, status }
}
console.log('form 11:', createTask({ title: 'Read' })) // form 11: { title: 'Read', status: 'todo' }

// Form 11 with my own data: describe a sailing. Only `line` is really needed.
function describeSailing({ line, departure = 'saat belli değil', express = false } = {}) {
  const kind = express ? 'ekspres' : 'normal'
  return `${line} (${kind}), kalkış: ${departure}`
}
console.log('form 11 (all):', describeSailing({ line: 'Kadıköy-Beşiktaş', departure: '18:10', express: true }))
console.log('form 11 (only line):', describeSailing({ line: 'Üsküdar-Karaköy-Eminönü' }))
console.log('form 11 (nothing):', describeSailing())

// The same function WITHOUT `= {}` after the pattern, called with nothing.
// tahminim: ...
function describeSailingNoDefault({ line, departure = 'saat belli değil' }) {
  return `${line}, kalkış: ${departure}`
}
try {
  console.log('form 11 (no = {}):', describeSailingNoDefault())
} catch (error) {
  console.log('form 11 (no = {}):', error.constructor.name, '-', error.message)
}

// Form 11b: the same idea with an array parameter, ([x, y]) => ...
// Each trip is a pair [from, to]; the arrow function takes the pair apart.
const trips = [['Kadıköy', 'Eminönü'], ['Beşiktaş', 'Üsküdar'], ['Kabataş', 'Kadıköy']]
const labels = trips.map(([from, to]) => `${from} -> ${to}`)
console.log('form 11b:', labels)

// Form 12: loops over entries, for (const [key, value] of Object.entries(obj)) and a Map
// A timetable object (sample times): Object.entries gives [time, line] pairs.
const timetable = { '07:30': 'Kadıköy-Karaköy-Eminönü', '08:15': 'Üsküdar-Eminönü', '09:00': 'Beşiktaş-Kadıköy' }
for (const [time, line] of Object.entries(timetable)) {
  console.log('form 12 (object):', time, line)
}

// A Map: how many times I took the ferry from each pier this week (my own numbers).
const myTrips = new Map([['Kadıköy', 5], ['Beşiktaş', 2], ['Üsküdar', 1]])
for (const [pier, count] of myTrips) {
  console.log('form 12 (Map):', pier, count)
}

// Without destructuring, the same loop needs entry[0] and entry[1].
for (const entry of myTrips) {
  console.log('form 12 (no pattern):', entry[0], entry[1])
}
