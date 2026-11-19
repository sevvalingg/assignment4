// Şevval Boyraz, 2200004208
// Forms 11 and 12 in TypeScript, and the typing rules for patterns in parameters.

type TaskInput = { title: string; status?: 'todo' | 'done' }

// Form 11 (worked example): the type goes after the whole pattern.
function createTask({ title, status = 'todo' }: TaskInput) {
  return { title, status }
}
console.log('form 11:', createTask({ title: 'Read' })) // form 11: { title: 'Read', status: 'todo' }

// Form 11 with my own data. All fields are optional, so the whole parameter can be left out.
type SailingOptions = { line?: string; departure?: string; express?: boolean }
function describeSailing({ line, departure = 'saat belli değil', express = false }: SailingOptions = {}): string {
  const kind = express ? 'ekspres' : 'normal'
  return `${line ?? 'hat belli değil'} (${kind}), kalkış: ${departure}`
}
console.log('form 11 (all):', describeSailing({ line: 'Kadıköy-Beşiktaş', departure: '18:10', express: true }))
console.log('form 11 (only line):', describeSailing({ line: 'Üsküdar-Karaköy-Eminönü' }))
console.log('form 11 (nothing):', describeSailing())

// Form 11b: an array parameter. Each trip is a tuple, so `from` and `to` are `string`.
type Trip = [from: string, to: string]
const trips: Trip[] = [['Kadıköy', 'Eminönü'], ['Beşiktaş', 'Üsküdar'], ['Kabataş', 'Kadıköy']]
const labels = trips.map(([from, to]) => `${from} -> ${to}`)
console.log('form 11b:', labels)

// Form 12: loops. Object.entries gives [string, string][] for a Record<string, string>.
const timetable: Record<string, string> = {
  '07:30': 'Kadıköy-Karaköy-Eminönü',
  '08:15': 'Üsküdar-Eminönü',
  '09:00': 'Beşiktaş-Kadıköy',
}
for (const [time, line] of Object.entries(timetable)) {
  console.log('form 12 (object):', time, line)
}

// A Map<string, number>: the pattern [pier, count] gets the types from the Map.
const myTrips = new Map<string, number>([['Kadıköy', 5], ['Beşiktaş', 2], ['Üsküdar', 1]])
for (const [pier, count] of myTrips) {
  console.log('form 12 (Map):', pier, count.toFixed(0))
}
