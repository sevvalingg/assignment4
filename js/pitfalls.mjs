// Şevval Boyraz, 2200004208
// Things that surprise people. Run with `node js/pitfalls.mjs`.

// Pitfall 1 (worked example): destructuring undefined or null throws a TypeError.
try {
  const { a } = undefined
  console.log(a)
} catch (error) {
  console.log('pitfall 1:', error.constructor.name) // pitfall 1: TypeError
}

// Pitfall 2: a default only applies to undefined, not to null
// The data says "capacity: null" (unknown), and I expected the default 300.
const unknownFerry = { line: 'Kabataş-Kadıköy', capacity: null }
const { capacity = 300 } = unknownFerry
console.log('pitfall 2:', capacity)
// Fix: use ?? after the pattern when null should also mean "missing".
const safeCapacity = unknownFerry.capacity ?? 300
console.log('pitfall 2 (fix with ??):', safeCapacity)

// Pitfall 3: assigning without const/let needs parentheses, ({ a } = obj)
// A line that starts with { is read as a block. I compile the bad line with
// new Function, so this file still runs and I can print the error.
try {
  new Function("let line; { line } = { line: 'Kadıköy-Beşiktaş' }")
  console.log('pitfall 3: no error')
} catch (error) {
  console.log('pitfall 3:', error.constructor.name, '-', error.message)
}
// Fix: wrap the whole assignment in parentheses.
let line
;({ line } = { line: 'Kadıköy-Beşiktaş' })
console.log('pitfall 3 (fix):', line)

// Pitfall 4: it copies references, not deep copies (nested objects are shared)
const sailing = { line: 'Kadıköy-Karaköy-Eminönü', pier: { name: 'Kadıköy', side: 'Anadolu' } }
const { pier } = sailing
const { line: copiedLine, ...rest } = sailing
pier.name = 'Moda' // I only meant to change my own variable...
console.log('pitfall 4 (original):', sailing.pier.name)
console.log('pitfall 4 (rest):', rest.pier.name)
console.log('pitfall 4 (same object?):', pier === sailing.pier, rest.pier === sailing.pier)

// Pitfall 5: in objects the order does not matter, in arrays it does
const route = { from: 'Beşiktaş', to: 'Üsküdar' }
const { to, from } = route // written in the "wrong" order, still correct
console.log('pitfall 5 (object):', from, '->', to)

const routePair = ['Beşiktaş', 'Üsküdar']
const [arrival, departure] = routePair // wrong order: the names lie now
console.log('pitfall 5 (array): departure =', departure, ', arrival =', arrival)

// Pitfall 6 (extra): a swap on a new line without a semicolon.
// The two lines are read as ONE expression: console.log(...)[a, b] = [b, a]
try {
  new Function(`
    let a = 'Eminönü'
    let b = 'Kadıköy'
    console.log('pitfall 6 before:', a, b)
    [a, b] = [b, a]
  `)()
} catch (error) {
  console.log('pitfall 6:', error.constructor.name, '-', error.message)
}
