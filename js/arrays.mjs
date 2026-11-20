// Şevval Boyraz, 2200004208

function minMax(numbers) {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1:', lowest, highest) // form 1: 2 9

// Form 1 with my own data: a function that returns the next sailing as [time, line].
function nextFerry() {
  return ['08:15', 'Kadıköy-Karaköy-Eminönü']
}
const [nextTime, nextLine] = nextFerry()
console.log('form 1 (ferry):', nextTime, nextLine)

// Form 2: skip an item and collect the rest, [, second, ...others]
// Haliç hattı: the first pier is where the ferry leaves, so I skip it.
const halicLine = ['Beşiktaş', 'Kabataş', 'Karaköy', 'Kasımpaşa', 'Hasköy', 'Sütlüce', 'Eyüp']
const [, firstStop, ...remainingStops] = halicLine
console.log('form 2:', firstStop, remainingStops)

// Form 2 with a line that has only one pier.
// tahminim:onlyStop hata verir afterThat ise boş bir dizi olur
const shortLine = ['Kabataş']
const [, onlyStop, ...afterThat] = shortLine
console.log('form 2 (one pier):', onlyStop, afterThat)

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
// The return trip of the Haliç line: departure and arrival change places.
let departure = 'Beşiktaş'
let arrival = 'Eyüp'
console.log('form 3 (going):', departure, '->', arrival)
;[departure, arrival] = [arrival, departure]
console.log('form 3 (return):', departure, '->', arrival)

// Form 4: default values, const [a = 1] = []
// If a route has no piers yet, use the busiest pair as a fallback.
const [from = 'Eminönü', to = 'Kadıköy'] = []
console.log('form 4 (empty):', from, '->', to)

// Only the first pier is given, so only the second default is used.
const [from2 = 'Eminönü', to2 = 'Kadıköy'] = ['Beşiktaş']
console.log('form 4 (one given):', from2, '->', to2)

// undefined triggers the default, null does not.
const [from3 = 'Eminönü', to3 = 'Kadıköy'] = [undefined, null]
console.log('form 4 (undefined, null):', from3, '->', to3)
