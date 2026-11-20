# Destructuring Field Guide

Name: Şevval Boyraz  
Student number: 2200004208

Bonuses claimed: **Bonus 1: LaTeX**, **Bonus 2: Depth**, **Bonus 3: Real code**, **Bonus 4: Git repository**

Bonus 4: Git repository — https://github.com/sevvalingg/assignment4

## Run

```
npm install
npm run all      # runs the JS and TS examples
npm run check    # type-checks in strict mode
npm run bonus    # the Bonus 2 experiments (not part of npm run all)
```

`output.txt` is the real output of `npm run all` on my machine. Two lines that you see in the
terminal are **not** in `output.txt`: React prints its warnings (about `key` and about a function
as a child, see P2 and P3) to stderr, and `>` only saves stdout.

## My data: Istanbul ferries

All examples use İstanbul ferry lines (Şehir Hatları): lines are arrays of piers, a sailing is an
object with a nested pier, a timetable is an object of `time -> line`, and my trips per pier are a
`Map`. The piers of the lines are the real ones (I checked them: the Kadıköy–Karaköy line does
not stop at Haydarpaşa any more, and the Haliç line goes Beşiktaş – Kabataş – Karaköy – Kasımpaşa –
Hasköy – Sütlüce – Eyüp). The departure times in the timetable are sample times, not the real
schedule.

```js
const sailing = {
  line: 'Kadıköy-Karaköy-Eminönü',
  departure: '08:15',
  operator: 'Şehir Hatları',
  pier: { name: 'Kadıköy', side: 'Anadolu' },
  stops: ['Kadıköy', 'Karaköy', 'Eminönü'],
}
```

## Field guide

Every entry has the same parts: syntax, example, real output, the same code **without**
destructuring (one plain assignment per variable, which is what the pattern really does),
*use it when* and *watch out*.

### Form 1: values by position, `const [x, y] = f()`

**Syntax:** `const [nextTime, nextLine] = nextFerry()`

**Example** (`js/arrays.mjs`):

```js
function nextFerry() {
  return ['08:15', 'Kadıköy-Karaköy-Eminönü']
}
const [nextTime, nextLine] = nextFerry()
console.log('form 1 (ferry):', nextTime, nextLine)
```

**Output:** `form 1 (ferry): 08:15 Kadıköy-Karaköy-Eminönü`

**Without destructuring:**

```js
const result = nextFerry()
const nextTime = result[0]
const nextLine = result[1]
```

**Use it when:** a function returns a few values that belong together and their order is fixed,
like `useState` and `useReducer` in React.

**Watch out:** the names come from the position, not from the data. If the function changes the
order, the names lie and nothing warns you in JavaScript. In TypeScript, give the function a tuple
return type (`[time: string, line: string]`); without it the return type is `string[]` and every
item is `string | undefined` (see the table).

### Form 2: skip an item and collect the rest, `const [, second, ...others] = list`

**Syntax:** `const [, firstStop, ...remainingStops] = halicLine`

**Example** (`js/arrays.mjs`):

```js
const halicLine = ['Beşiktaş', 'Kabataş', 'Karaköy', 'Kasımpaşa', 'Hasköy', 'Sütlüce', 'Eyüp']
const [, firstStop, ...remainingStops] = halicLine
console.log('form 2:', firstStop, remainingStops)

const shortLine = ['Kabataş']
const [, onlyStop, ...afterThat] = shortLine
console.log('form 2 (one pier):', onlyStop, afterThat)
```

**Output:**

```
form 2: Kabataş [ 'Karaköy', 'Kasımpaşa', 'Hasköy', 'Sütlüce', 'Eyüp' ]
form 2 (one pier): undefined []
```

**Without destructuring:**

```js
const firstStop = halicLine[1]
const remainingStops = halicLine.slice(2)
```

**Use it when:** the first item has a different role (here: the pier the ferry leaves from) and
you want "the next one" and "all the others".

**Watch out:** the empty place before the first comma is easy to miss when you read the code. A
missing item is **not** an error, it is `undefined`, but the rest is never `undefined`: it is
always an array, an empty one when nothing is left. The rest must be last (`[...a, b]` is a
syntax error). Rest in a pattern (`...remainingStops`, on the left) **collects** items into a new
array; spread in an expression (`[...halicLine]`, on the right) **expands** an array into items.
Same three dots, opposite jobs.

### Form 3: swap two variables, `[a, b] = [b, a]`

**Syntax:** `[departure, arrival] = [arrival, departure]`

**Example** (`js/arrays.mjs`):

```js
let departure = 'Beşiktaş'
let arrival = 'Eyüp'
console.log('form 3 (going):', departure, '->', arrival)
;[departure, arrival] = [arrival, departure]
console.log('form 3 (return):', departure, '->', arrival)
```

**Output:**

```
form 3 (going): Beşiktaş -> Eyüp
form 3 (return): Eyüp -> Beşiktaş
```

**Without destructuring:**

```js
const temp = departure
departure = arrival
arrival = temp
```

**Use it when:** two variables must change places (here: the return trip of the line).

**Watch out:** the right side is built first, as a new array `[arrival, departure]`, and only then
taken apart, which is why no temporary variable is needed. The variables must be `let`. Without
semicolons in the file, a line that starts with `[` is glued to the line before it: that is why
there is a `;` at the start of the line (see pitfall 6).

### Form 4: default values in arrays, `const [a = 1, b = 2] = []`

**Syntax:** `const [from = 'Eminönü', to = 'Kadıköy'] = []`

**Example** (`js/arrays.mjs`):

```js
const [from = 'Eminönü', to = 'Kadıköy'] = []
console.log('form 4 (empty):', from, '->', to)

const [from2 = 'Eminönü', to2 = 'Kadıköy'] = ['Beşiktaş']
console.log('form 4 (one given):', from2, '->', to2)

const [from3 = 'Eminönü', to3 = 'Kadıköy'] = [undefined, null]
console.log('form 4 (undefined, null):', from3, '->', to3)
```

**Output:**

```
form 4 (empty): Eminönü -> Kadıköy
form 4 (one given): Beşiktaş -> Kadıköy
form 4 (undefined, null): Eminönü -> null
```

**Without destructuring:**

```js
const from = list[0] === undefined ? 'Eminönü' : list[0]
const to = list[1] === undefined ? 'Kadıköy' : list[1]
```

**Use it when:** a list may be shorter than you need and there is a sensible fallback.

**Watch out:** the default is used **only for `undefined`**. `null` is a real value and stays
`null` (last line of the output). The plain version above shows it: the check is
`=== undefined`, not "is empty".

### Form 5: properties by name, `let { a, b } = t`

**Syntax:** `const { line, departure } = sailing`

**Example** (`js/objects.mjs`):

```js
const { line, departure } = sailing
console.log('form 5 (ferry):', line, departure)
```

**Output:** `form 5 (ferry): Kadıköy-Karaköy-Eminönü 08:15`

**Without destructuring:**

```js
const line = sailing.line
const departure = sailing.departure
```

**Use it when:** you need a few fields of an object and the field names are good variable names.

**Watch out:** the variable name **must** be the property name; a name that is not in the object
gives `undefined` without an error (a typo like `{ departue }` is silent in JavaScript, TypeScript
catches it, see T5). The order inside `{ }` does not matter (pitfall 5).

### Form 6: rename while you take it, `const { a: alpha } = t`

**Syntax:** `const { line: eveningLine, departure: eveningTime } = evening`

**Example** (`js/objects.mjs`):

```js
// `line` and `departure` already exist from form 5, so I must rename.
const evening = { line: 'Üsküdar-Eminönü', departure: '19:40' }
const { line: eveningLine, departure: eveningTime } = evening
console.log('form 6:', eveningLine, eveningTime)
```

**Output:** `form 6: Üsküdar-Eminönü 19:40`

**Without destructuring:**

```js
const eveningLine = evening.line
const eveningTime = evening.departure
```

**Use it when:** the property name is already used by another variable in the same scope (my
case: `line` exists from form 5, and `const { line } = evening` would be
`SyntaxError: Identifier 'line' has already been declared`), or the name is not clear here.

**Watch out:** read `line: eveningLine` as "take `line`, call it `eveningLine`": the source is on
the left of the colon, the new name on the right. After this, `line` from *this* object is not a
variable. In TypeScript the colon is **not** a type (T1).

### Form 7: default values in objects, `const { a = 1 } = t`

**Syntax:** `const { express = false, capacity = 300 } = sailing`

**Example** (`js/objects.mjs`):

```js
const { express = false, capacity = 300 } = sailing
console.log('form 7 (missing):', express, capacity)

const fastSailing = { line: 'Beşiktaş-Kadıköy', express: true, capacity: undefined }
const { express: isExpress = false, capacity: seats = 300 } = fastSailing
console.log('form 7 (given):', isExpress, seats)
```

**Output:**

```
form 7 (missing): false 300
form 7 (given): true 300
```

**Without destructuring:**

```js
const express = sailing.express === undefined ? false : sailing.express
const capacity = sailing.capacity === undefined ? 300 : sailing.capacity
```

**Use it when:** a field is optional and most objects do not have it (most ferries are not
express).

**Watch out:** `capacity: undefined` written in the object still gets the default, because the
rule is "the value is `undefined`", not "the key is missing". `null` does **not** get the default
(pitfall 2, P6). Rename and default can be combined: `capacity: seats = 300`.

### Form 8: rest in an object, `const { a, ...others } = t`

**Syntax:** `const { operator, ...sailingInfo } = sailing`

**Example** (`js/objects.mjs`):

```js
const { operator, ...sailingInfo } = sailing
console.log('form 8:', operator)
console.log('form 8 rest:', sailingInfo)
```

**Output:**

```
form 8: Şehir Hatları
form 8 rest: {
  line: 'Kadıköy-Karaköy-Eminönü',
  departure: '08:15',
  pier: { name: 'Kadıköy', side: 'Anadolu' },
  stops: [ 'Kadıköy', 'Karaköy', 'Eminönü' ]
}
```

**Without destructuring:**

```js
const operator = sailing.operator
const sailingInfo = { ...sailing }
delete sailingInfo.operator
```

**Use it when:** you want to take one or two fields out and pass "everything else" on. This is
exactly what React components do with `{ title, children, ...rest }` (P4).

**Watch out:** `sailingInfo` is a **new** object, but it is a shallow copy: `sailingInfo.pier` is
the same object as `sailing.pier` (pitfall 4). The rest must be the last item in the pattern.

### Form 9: nested patterns and arrays inside objects, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { pier: { name: pierName, side }, stops: [firstPier, , lastPier] } = sailing`

**Example** (`js/objects.mjs`):

```js
const {
  pier: { name: pierName, side },
  stops: [firstPier, , lastPier],
} = sailing
console.log('form 9:', pierName, side, firstPier, lastPier)

try {
  const nightSailing = { line: 'Kabataş-Kadıköy' }
  const { pier: { name: nightPier } } = nightSailing
  console.log('form 9 (no pier):', nightPier)
} catch (error) {
  console.log('form 9 (no pier):', error.message)
}
```

**Output:**

```
form 9: Kadıköy Anadolu Kadıköy Eminönü
form 9 (no pier): Cannot read properties of undefined (reading 'name')
```

**Without destructuring:**

```js
const pierName = sailing.pier.name
const side = sailing.pier.side
const firstPier = sailing.stops[0]
const lastPier = sailing.stops[2]
```

**Use it when:** you need a few values from deep inside an object, and the shape is known.

**Watch out:** `pier` and `stops` are **not** variables here; `pier:` only means "go inside". If
the inner object is missing, a missing field (`undefined`) is fine, but going *into* it is a
`TypeError` (second output line): the plain version is `sailing.pier.name` with
`sailing.pier === undefined`. The fix is a default for the inner object:
`const { pier: { name } = {} } = nightSailing`.

### Form 10: a computed key, `const { [key]: value } = t`

**Syntax:** `const { [wanted]: lineAtTime } = timetable`

**Example** (`js/objects.mjs`):

```js
const timetable = { '07:30': 'Kadıköy-Karaköy-Eminönü', '08:15': 'Üsküdar-Eminönü', '09:00': 'Beşiktaş-Kadıköy' }
const wanted = '08:15'
const { [wanted]: lineAtTime } = timetable
console.log('form 10:', wanted, lineAtTime)

const field = 'operator'
const { [field]: chosen } = sailing
console.log('form 10 (field):', field, chosen)
```

**Output:**

```
form 10: 08:15 Üsküdar-Eminönü
form 10 (field): operator Şehir Hatları
```

**Without destructuring:**

```js
const lineAtTime = timetable[wanted]
```

**Use it when:** the key is only known at run time (a time the user picked, a field name from a
setting).

**Watch out:** a computed key always needs a new name after the colon (`{ [wanted] }` alone is a
syntax error, there is no name to give the variable). `[wanted]` means "the **value** of
`wanted`", not a key called `"wanted"`. Honestly the plain `timetable[wanted]` is shorter; the
pattern is useful when you take several things at once.

### Form 11: patterns in parameters, with defaults, `function f({ a = 1, b } = {})`

**Syntax:** `function describeSailing({ line, departure = 'saat belli değil', express = false } = {})`

**Example** (`js/params.mjs`):

```js
function describeSailing({ line, departure = 'saat belli değil', express = false } = {}) {
  const kind = express ? 'ekspres' : 'normal'
  return `${line} (${kind}), kalkış: ${departure}`
}
console.log('form 11 (all):', describeSailing({ line: 'Kadıköy-Beşiktaş', departure: '18:10', express: true }))
console.log('form 11 (only line):', describeSailing({ line: 'Üsküdar-Karaköy-Eminönü' }))
console.log('form 11 (nothing):', describeSailing())

// Form 11b: an array parameter
const trips = [['Kadıköy', 'Eminönü'], ['Beşiktaş', 'Üsküdar'], ['Kabataş', 'Kadıköy']]
const labels = trips.map(([from, to]) => `${from} -> ${to}`)
console.log('form 11b:', labels)
```

**Output:**

```
form 11 (all): Kadıköy-Beşiktaş (ekspres), kalkış: 18:10
form 11 (only line): Üsküdar-Karaköy-Eminönü (normal), kalkış: saat belli değil
form 11 (nothing): undefined (normal), kalkış: saat belli değil
form 11 (no = {}): TypeError - Cannot destructure property 'line' of 'undefined' as it is undefined.
form 11b: [ 'Kadıköy -> Eminönü', 'Beşiktaş -> Üsküdar', 'Kabataş -> Kadıköy' ]
```

**Without destructuring:**

```js
function describeSailing(options) {
  if (options === undefined) options = {}
  const line = options.line
  const departure = options.departure === undefined ? 'saat belli değil' : options.departure
  const express = options.express === undefined ? false : options.express
  // ...
}
```

**Use it when:** a function takes an "options object": the caller writes names instead of
remembering an order, and can leave things out. Every React component is this form (P1).

**Watch out:** there are **two** defaults: the ones inside the pattern (for missing fields) and
`= {}` after it (for a missing argument). Without `= {}`, calling with no argument throws the
`TypeError` in the fourth output line, because there is no object to take apart.

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))` and Map entries

**Syntax:** `for (const [pier, count] of myTrips)`

**Example** (`js/params.mjs`):

```js
for (const [time, line] of Object.entries(timetable)) {
  console.log('form 12 (object):', time, line)
}

const myTrips = new Map([['Kadıköy', 5], ['Beşiktaş', 2], ['Üsküdar', 1]])
for (const [pier, count] of myTrips) {
  console.log('form 12 (Map):', pier, count)
}
```

**Output:**

```
form 12 (object): 07:30 Kadıköy-Karaköy-Eminönü
form 12 (object): 08:15 Üsküdar-Eminönü
form 12 (object): 09:00 Beşiktaş-Kadıköy
form 12 (Map): Kadıköy 5
form 12 (Map): Beşiktaş 2
form 12 (Map): Üsküdar 1
```

**Without destructuring:**

```js
for (const entry of myTrips) {
  console.log(entry[0], entry[1])
}
```

**Use it when:** you loop over key–value pairs. Iterating a `Map` gives `[key, value]` arrays,
and `Object.entries` turns an object into the same shape.

**Watch out:** a plain object is **not** iterable: `for (const [k, v] of timetable)` is a
`TypeError`, you need `Object.entries`. Each pair is an array, so the pattern uses `[ ]`, not
`{ }`. `Object.entries` gives keys as strings, even for number keys.

## Pitfalls

All from `js/pitfalls.mjs`.

### Pitfall 1: destructuring `undefined` or `null` throws

```js
const { a } = undefined
```

**Output:** `pitfall 1: TypeError`

**Why:** a pattern reads properties of the value on the right. `undefined` and `null` have no
properties at all, so even the first read (`undefined.a`) fails. Fix: a default for the whole
value (`= {}`) or a check before.

### Pitfall 2: a default only applies to `undefined`, not to `null`

```js
const unknownFerry = { line: 'Kabataş-Kadıköy', capacity: null }
const { capacity = 300 } = unknownFerry
const safeCapacity = unknownFerry.capacity ?? 300
```

**Output:**

```
pitfall 2: null
pitfall 2 (fix with ??): 300
```

**Why:** the language checks `value === undefined` before it uses a default. `null` means "there
is a value and it is nothing", so it is kept. Data from a server often has `null` for "unknown";
use `??` (which treats `null` and `undefined` the same) when `null` should also get the fallback.

### Pitfall 3: assignment without `const`/`let` needs parentheses

```js
new Function("let line; { line } = { line: 'Kadıköy-Beşiktaş' }")
// fix:
;({ line } = { line: 'Kadıköy-Beşiktaş' })
```

**Output:**

```
pitfall 3: SyntaxError - Unexpected token '='
pitfall 3 (fix): Kadıköy-Beşiktaş
```

**Why:** at the start of a statement `{` opens a **block**, not an object pattern, so `{ line }`
is a block with the word `line` in it, and the `=` after a block makes no sense. Parentheses make
it an expression. (I compile the bad line with `new Function` so that the rest of the file still
runs; written directly, the whole file would not start.)

### Pitfall 4: it copies references, not objects

```js
const sailing = { line: 'Kadıköy-Karaköy-Eminönü', pier: { name: 'Kadıköy', side: 'Anadolu' } }
const { pier } = sailing
const { line: copiedLine, ...rest } = sailing
pier.name = 'Moda'
```

**Output:**

```
pitfall 4 (original): Moda
pitfall 4 (rest): Moda
pitfall 4 (same object?): true true
```

**Why:** `const { pier } = sailing` is `const pier = sailing.pier`: the variable points to the
**same** object. Rest makes a new outer object but copies the inner ones by reference too. To
change a copy safely you need a real copy (`structuredClone(sailing)` or `{ ...sailing, pier: { ...sailing.pier } }`).

### Pitfall 5: in objects the order does not matter, in arrays it does

```js
const route = { from: 'Beşiktaş', to: 'Üsküdar' }
const { to, from } = route
const routePair = ['Beşiktaş', 'Üsküdar']
const [arrival, departure] = routePair
```

**Output:**

```
pitfall 5 (object): Beşiktaş -> Üsküdar
pitfall 5 (array): departure = Üsküdar , arrival = Beşiktaş
```

**Why:** object patterns match by **name**, array patterns by **position**. In the array version
my names are wrong (Beşiktaş is the departure) and JavaScript cannot know it. This is the reason
React's `useState` returns an array (you choose the names) and most other APIs return objects
(the names are fixed and safe).

### Pitfall 6: a swap without a semicolon on the line before

```js
let a = 'Eminönü'
let b = 'Kadıköy'
console.log('pitfall 6 before:', a, b)
[a, b] = [b, a]
```

**Output:**

```
pitfall 6 before: Eminönü Kadıköy
pitfall 6: TypeError - Cannot set properties of undefined (setting 'Kadıköy')
```

**Why:** JavaScript only inserts a semicolon automatically when the next line cannot continue the
statement. A `[` *can* continue it, so the two lines are read as one:
`console.log(...)[a, b] = [b, a]`. `console.log` returns `undefined`, `[a, b]` is the comma
operator (= `b` = `'Kadıköy'`), and the code tries `undefined['Kadıköy'] = ...`. Fix: start the
line with `;` (as in form 3).

## Props and children

Code: `js/props.jsx` (P1–P6 and one extra) and `ts/props.tsx` (P1–P7, typed). Rendered with
`renderToStaticMarkup`, so the output is the real HTML.

### P1: props is one object

```jsx
function LineCardA(props) {
  return <section><h2>{props.line}</h2><p>{props.operator}</p>{props.children}</section>
}
function LineCardB({ line, operator, children }) {
  return <section><h2>{line}</h2><p>{operator}</p>{children}</section>
}
function ShowProps(props) {
  console.log('P1 props object:', props)
  return null
}
renderToStaticMarkup(<ShowProps line="Kabataş-Kadıköy" express>sabah seferi</ShowProps>)
```

**Output:**

```
P1 A: <section><h2>Kadıköy-Beşiktaş</h2><p>Şehir Hatları</p>Her 30 dakikada bir</section>
P1 B: <section><h2>Kadıköy-Beşiktaş</h2><p>Şehir Hatları</p>Her 30 dakikada bir</section>
P1 props object: { line: 'Kabataş-Kadıköy', express: true, children: 'sabah seferi' }
```

React calls the component as a function with **one** argument: an object made from the JSX
attributes, plus `children`. `LineCardB` is form 11 (a pattern in the parameter list) applied to
that object with form 5 (properties by name). `LineCardA` is the same code without
destructuring. The printed object shows that `children` is simply one more field of it, next to
`line`, and that `express` with no value becomes `true`.

### P2: children is only a prop

```jsx
<LineCardB line="Üsküdar-Eminönü">İlk sefer 07:00</LineCardB>
<LineCardB line="Üsküdar-Eminönü" children="İlk sefer 07:00" />
<LineCardB line="Üsküdar-Eminönü" children="attribute">between tags</LineCardB>
```

**Output:**

```
P2 between tags: <section><h2>Üsküdar-Eminönü</h2><p></p>İlk sefer 07:00</section>
P2 as attribute: <section><h2>Üsküdar-Eminönü</h2><p></p>İlk sefer 07:00</section>
P2 both: <section><h2>Üsküdar-Eminönü</h2><p></p>between tags</section>
```

The first two are identical: content between the tags is only a nicer way to write the
`children` prop. When both are given, the content between the tags wins: JSX turns into
`jsx(LineCardB, { line, children: 'attribute', children: 'between tags' })`, and like in any object
the later key overwrites the earlier one. (The empty `<p></p>` is because I gave no `operator`.)

`key` is the opposite case: it looks like a prop but is not one. React takes it out before the
component is called:

```
P2 key: <span>key is undefined</span>
```

and prints this warning on stderr (so it is not in `output.txt`):
`ShowKey: \`key\` is not a prop. Trying to access it will result in \`undefined\` being returned.`

### P3: what children can be

Each value rendered inside `<div>[{children}]</div>`:

| children | output | appears? |
|---|---|---|
| `'Kadıköy'` | `<div>[Kadıköy]</div>` | yes |
| `42` | `<div>[42]</div>` | yes |
| `0` | `<div>[0]</div>` | **yes** |
| `<b>Eminönü</b>` | `<div>[<b>Eminönü</b>]</div>` | yes |
| `[<b>Beşiktaş</b>, <i>Üsküdar</i>]` | `<div>[<b>Beşiktaş</b><i>Üsküdar</i>]</div>` | yes, one after the other |
| `undefined` | `<div>[]</div>` | no |
| `null` | `<div>[]</div>` | no |
| `false` | `<div>[]</div>` | no |
| `true` | `<div>[]</div>` | no |
| `''` | `<div>[]</div>` | no (empty text) |
| `() => 'Kabataş'` | `<div>[]</div>` | no, and a warning |

`undefined`, `null` and booleans render nothing on purpose, so that `{isExpress && <b>ekspres</b>}`
works: when the condition is `false` nothing appears. The surprise is `0`: it is a number, so it is
printed. `{count && <b>...</b>}` with `count = 0` shows a `0` on the screen; write
`{count > 0 && ...}`. A function is not something React can render; it warns
`Functions are not valid as a React child` and renders nothing. A function *does* work as
children when the component **calls** it (a "render prop"):

```jsx
function NextSailing({ children }) {
  const time = '08:15'
  return <p>{children(time)}</p>
}
<NextSailing>{(time) => `Sonraki vapur ${time}`}</NextSailing>
```

**Output:** `P3 function, called: <p>Sonraki vapur 08:15</p>`

### P4: separating children from the other props

```jsx
function PierSection({ title, children, ...rest }) {
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
<PierSection title="Kadıköy İskelesi" id="kadikoy" className="pier" data-side="Anadolu">Beşiktaş, Eminönü, Karaköy</PierSection>

function SpreadThenExplicit({ children, ...rest }) {
  return <section {...rest} className="fixed">{children}</section>
}
function ExplicitThenSpread({ children, ...rest }) {
  return <section className="fixed" {...rest}>{children}</section>
}
```

**Output:**

```
P4 rest: <section id="kadikoy" class="pier" data-side="Anadolu"><h3>Kadıköy İskelesi</h3>Beşiktaş, Eminönü, Karaköy</section>
P4 spread then explicit: <section class="fixed">x</section>
P4 explicit then spread: <section class="from-parent">x</section>
P4 title not in rest: <section lang="tr"><h3>Beşiktaş</h3>x</section>
```

`{ title, children, ...rest }` is form 8 on the props object: the two props the component uses
itself are taken out by name, and every other prop (`id`, `className`, `data-side`) goes into
`rest` and is spread onto the real `<section>`. This is how a component lets the caller add any
HTML attribute without listing them all.

The order of `{...rest}` and an explicit prop decides who wins: **the last one written wins**,
exactly like keys in an object literal (`{ ...rest, className: 'fixed' }` vs
`{ className: 'fixed', ...rest }`). Put the explicit prop after the spread when the component
must keep control, before it when the caller may override it. A name taken out by the pattern
(`title`) is not in `rest`, so it does not leak onto the `<section>` as an HTML attribute.

### P5: props or children?

```jsx
function TimetableWithProps({ header, footer, children }) {
  return (
    <article>
      <header>{header}</header>
      <ul>{children}</ul>
      <footer>{footer}</footer>
    </article>
  )
}
function TimetableWithChildren({ children }) {
  return <article>{children}</article>
}
```

**Output:**

```
P5 props: <article><header>Kadıköy-Karaköy-Eminönü</header><ul><li>07:30</li><li>08:15</li></ul><footer>Tarife değişebilir</footer></article>
P5 children: <article><header>Kadıköy-Karaköy-Eminönü</header><ul><li>07:30</li><li>08:15</li></ul><footer>Tarife değişebilir</footer></article>
```

The HTML is the same; the difference is **who decides the structure**. With `header` and `footer`
props, the component owns the layout: every timetable card has the header first, the list in a
`<ul>`, the footer last, and the caller cannot get it wrong. With children only, the component is
just a frame and the caller writes everything inside, so the caller can also forget the footer
or put things in another order. I would use props for named parts that every card must have in
fixed places (a header, a footer, an icon) and children for the main free content, which is what
`TimetableWithProps` does: named slots as props, the list as children.

### P6: defaults for props

```jsx
function SailingBadge({ kind = 'normal sefer' }) {
  return <span className="badge">{kind}</span>
}
<SailingBadge />
<SailingBadge kind={undefined} />
<SailingBadge kind={null} />
<SailingBadge kind="ekspres" />
```

**Output:**

```
P6 missing: <span class="badge">normal sefer</span>
P6 undefined: <span class="badge">normal sefer</span>
P6 null: <span class="badge"></span>
P6 given: <span class="badge">ekspres</span>
```

This is form 7 on the props object. A missing prop and `kind={undefined}` are the same thing
(the value is `undefined`), so both get the default. `kind={null}` is a value, the default is not
used, and `null` renders nothing (P3): on the screen the user sees an **empty badge**, a coloured
box with no text. If `null` can come from data, use `kind ?? 'normal sefer'` in the body.

### Extra: a component that changes its props

```jsx
function ChangesProps(props) {
  props.line = 'changed'
  // ...
}
```

**Output:** `extra change props: <p>TypeError: Cannot assign to read only property &#x27;line&#x27; of object &#x27;#&lt;Object&gt;&#x27;</p>`

In development React freezes the props object, so a component cannot change what it received.
Props are input; if a value must change, it belongs in state.

### P7: types for props and children (`ts/props.tsx`)

**(a) `children?: ReactNode`, written by hand.** `ReactNode` is "anything React can render":
string, number, element, array of those, `null`, `undefined`, boolean. With `?` the component can
also be used with nothing inside.

```tsx
type NoteProps = { pier: string; children?: ReactNode }
function Note({ pier, children }: NoteProps) {
  return <p><b>{pier}:</b> {children}</p>
}
```

Output: `P7 ReactNode: <p><b>Beşiktaş:</b> iskele yenileniyor</p>` and
`P7 ReactNode, empty: <p><b>Beşiktaş:</b> </p>`.
Rejected: `<Note pier="Beşiktaş">{() => 'x'}</Note>` gives
`error TS2322: Type '() => string' is not assignable to type 'ReactNode'.` That is P3's function
case caught before running. If you want a function as children, the type must say so:
`children: (time: string) => ReactNode` (the `NextSailing` render prop in `ts/props.tsx`).

**(b) `PropsWithChildren<P>`** adds `children?: ReactNode` to your own props type.

```tsx
type CrossingProps = PropsWithChildren<{ from: string; to: string }>
```

Output: `P7 PropsWithChildren: <p>Kabataş → Kadıköy (20 dk)</p>`.
Rejected: `<Crossing from="Kabataş">x</Crossing>` gives
`error TS2741: Property 'to' is missing in type '{ children: string; from: string; }' but required in type '{ from: string; to: string; }'.`
Note how the compiler shows `children` as one of the props: the type checker agrees with P2.

**(c) `ComponentProps<'button'>`** is every prop a real `<button>` accepts (`disabled`, `onClick`,
`aria-label`, `children`, ...), so a wrapper can accept them all and pass them on with rest/spread.

```tsx
type TicketButtonProps = ComponentProps<'button'> & { price: number }
function TicketButton({ price, children, type = 'button', ...rest }: TicketButtonProps) {
  return <button type={type} {...rest}>{children} ({price} TL)</button>
}
```

Output: `P7 ComponentProps: <button type="button" disabled="" aria-label="bilet al">Bilet al (59 TL)</button>`.
Rejected: `<TicketButton price={59} href="/bilet">` gives `error TS2322: ... Property 'href' does
not exist on type '...'. Did you mean 'ref'?` (a button has no `href`), and `<TicketButton>`
without `price` gives `error TS2741: Property 'price' is missing in type '{ children: string; }' but required in type '{ price: number; }'.`

The rejected lines are written as comments in `ts/props.tsx` with these messages, because the
handout allows `@ts-expect-error` only in T5. I got the messages by compiling each line once.

Summary of the difference: **props** are the named inputs of a component (attributes in JSX);
**children** is one specific prop that holds what you write between the tags. Use named props
when the component must know *what* each thing is and *where* it goes; use children when the
component only wraps content it does not need to understand.

## TypeScript topics

Code: `ts/types.ts`.

### T1: in a pattern, `{ a: string }` is a rename, not a type

```ts
const sailing = { line: 'Kadıköy-Karaköy-Eminönü', departure: '08:15', capacity: 300 }
const { line: string } = sailing
console.log('T1 (confusion): a variable named string =', string)

const { departure, capacity }: { departure: string; capacity: number } = sailing
```

**Output:**

```
T1 (confusion): a variable named string = Kadıköy-Karaköy-Eminönü
T1 (correct): 08:15 300
```

The first line compiles, which is the dangerous part: it creates a variable called `string`.
Inside a pattern the colon always means "rename" (form 6). The type is written once, **after**
the whole pattern, describing the whole object. With two fields renamed to `string` you would
get `error TS2451: Cannot redeclare block-scoped variable 'string'.`

### T2: tuple return types and `as const`

```ts
function nextSailing(): [time: string, line: string] {
  return ['08:15', 'Üsküdar-Eminönü']
}
const [nextTime, nextLine] = nextSailing()       // string, string

const plainPair = ['Kadıköy', 'Eminönü']          // string[]
const [plainFrom] = plainPair                      // string | undefined

const fixedPair = ['Kadıköy', 'Eminönü'] as const // readonly ['Kadıköy', 'Eminönü']
const [fixedFrom, fixedTo] = fixedPair             // 'Kadıköy', 'Eminönü'
const homePier: 'Kadıköy' = fixedFrom
```

**Output:**

```
T2 (tuple): 08:15 Üsküdar-Eminönü
T2 (no as const): Kadıköy
T2 (as const): Kadıköy Eminönü
```

A tuple type fixes the length and the type of each position, so destructured items are never
`undefined`. An array literal without annotation is just `string[]`. `as const` makes it a
readonly tuple of **literal** types: `fixedFrom` has the type `'Kadıköy'`, which is why it can be
assigned to a variable of type `'Kadıköy'`; `plainFrom` could not.

### T3: `noUncheckedIndexedAccess`

```ts
const todaysPiers: string[] = ['Beşiktaş', 'Üsküdar']
const [firstPier] = todaysPiers                    // string | undefined
if (firstPier !== undefined) {
  console.log('T3 (check):', firstPier.toUpperCase()) // narrowed to string here
}
console.log('T3 (??):', (firstPier ?? 'yok').toUpperCase())
const [pierWithDefault = 'yok'] = todaysPiers      // string
```

**Output:** `T3 (check): BEŞIKTAŞ`, `T3 (??): BEŞIKTAŞ`, `T3 (default): BEŞIKTAŞ`

With this option on, every item read from an array of unknown length gets `| undefined`, because
the array could be shorter (form 2 showed that at run time). Calling a method on it directly is
`error TS18048: 'firstPier' is possibly 'undefined'.` (I got this exact error when I tried
`firstStop.toUpperCase()` in `ts/arrays.ts`.) Three fixes: check it (TypeScript narrows the type
inside the `if`), use `??`, or give the pattern a default.

### T4: optional fields and defaults change the type

```ts
type FerryOptions = { express?: boolean; note?: string | null }
const options: FerryOptions = { note: null }
const { express } = options                        // boolean | undefined
const { express: expressOrFalse = false } = options // boolean
const { note = 'not yok' } = options               // string | null
```

**Output:** `T4: undefined false null`

An optional field (`?`) adds `undefined` to the type of the variable. A default removes
`undefined`, because TypeScript knows the run-time rule (form 7). It does **not** remove `null`,
because at run time `null` does not trigger the default (pitfall 2): the type and the behaviour
agree, and the output shows `null`.

### T5: one compile error caused by destructuring

```ts
// @ts-expect-error -- `platform` is not in the type of `sailing`
const { platform } = sailing
```

Without the comment line:

```
error TS2339: Property 'platform' does not exist on type '{ line: string; departure: string; capacity: number; }'.
```

**Output with the comment:** `T5 (runs anyway, but): undefined`

In JavaScript a name that is not in the object silently gives `undefined`; TypeScript refuses it,
which catches typos. `@ts-expect-error` silences exactly one error on the next line (and is itself
an error if there is none). The fix is to put the field in the type, as optional because not
every sailing has one:

```ts
type SailingWithPlatform = { line: string; departure: string; platform?: number }
const { platform: platformNumber = 1 } = withPlatform
```

**Output:** `T5 (fix): 2`

## JavaScript vs TypeScript

What stays the same, what TypeScript needs in addition, and the real error when it is missing or
wrong. Every error below I produced by compiling the wrong line with `npm run check`.

| Form | Same in TypeScript | What you add | Error when you get it wrong |
|---|---|---|---|
| 1 `const [a, b] = f()` | the pattern | a tuple return type `[time: string, line: string]` | without it the result is `number[]`, then `lo.toFixed()`: `TS18048: 'lo1' is possibly 'undefined'.` |
| 2 `const [, x, ...rest] = list` | pattern, rest is an array | nothing, but `x` is `T \| undefined` | `firstStop.toUpperCase()`: `TS18048: 'firstStop' is possibly 'undefined'.` |
| 3 `[a, b] = [b, a]` | the swap | both variables must have the same type | `let a: string, b: number`: `TS2322: Type 'number' is not assignable to type 'string'.` |
| 4 `const [a = 1] = list` | defaults | the default must fit the item type | `const [x = 5]: string[] = []`: `TS2322: Type 'number' is not assignable to type 'string'.` |
| 5 `const { a } = t` | the pattern | nothing, the types come from `t` | a name not in the type: `TS2339: Property 'platform' does not exist on type ...` |
| 6 `const { a: b } = t` | rename | the type goes after the pattern, not after the colon | `{ line: string, departure: string }`: `TS2451: Cannot redeclare block-scoped variable 'string'.` |
| 7 `const { a = 1 } = t` | defaults | `?` on optional fields | no default, then `const e: boolean = express`: `TS2322: Type 'boolean \| undefined' is not assignable to type 'boolean'.` |
| 8 `const { a, ...rest } = t` | rest | nothing, the rest type is computed (`Omit<T, 'a'>`) | `info.operator`: `TS2339: Property 'operator' does not exist on type '{ line: string; }'.` |
| 9 `const { p: { x } } = t` | nesting | a default for an optional inner object | `pier?: Pier` without default: `TS2339: Property 'name' does not exist on type 'Pier \| undefined'.` |
| 10 `const { [k]: v } = t` | computed key | a `Record<string, T>` or `keyof` type | `v.toUpperCase()`: `TS18048: 'v10' is possibly 'undefined'.` |
| 11 `function f({ a } = {})` | pattern and defaults | a type after the pattern: `({ a }: Options = {})` | no type: `TS7031: Binding element 'line' implicitly has an 'any' type.` |
| 12 `for (const [k, v] of map)` | the loop | `new Map<string, number>()` | `count.toUpperCase()`: `TS2339: Property 'toUpperCase' does not exist on type 'number'.` |

## My own log

<!--
  ŞEVVAL: Bu bölümü sen yazacaksın, kendi cümlelerinle (İngilizce).
  Hoca burada senin gerçek hatalarını ve yanlış tahminlerini istiyor.
  Her madde için: ne yaptın, ne bekledin, ne oldu (hata mesajı aynen), ne öğrendin.
  Aşağıdaki başlıklar ve hata mesajları gerçek; açıklamaları sen doldur, sonra bu yorumu sil.
-->

1. **npm install in the wrong folder.**
   Error: `npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open 'C:\Users\Şevval\webproje\package.json'`
   (write here what happened and what you learned)

2. **Form 2 with a one-pier line.**
   My guess (written in the file before running): `onlyStop hata verir, afterThat boş dizi olur`.
   Real output: `form 2 (one pier): undefined []`
   (write here what was wrong in your guess and why)

3. **Form 9 with a missing `pier`.**
   My guess: `nightPier undefined olur, program devam eder`.
   Real output: `Cannot read properties of undefined (reading 'name')`
   (write here why)

4. **TypeScript: `firstStop.toUpperCase()`.**
   Error: `ts/arrays.ts:16:24 - error TS18048: 'firstStop' is possibly 'undefined'.`
   (write here)

5. **Pasting terminal output back into the terminal.**
   PowerShell ran every line as a command: `The term 'form' is not recognized as the name of a cmdlet ...`
   and `Get-Process : A positional parameter cannot be found that accepts argument 'npm'.`
   (write here: why did `PS C:\...> npm run check` call Get-Process?)

6. **`npm warn install-scripts ... esbuild@0.28.2 (postinstall: node install.js)`**
   (write here what it means and why tsx still worked)

7. **`warning: in the working copy of 'js/arrays.mjs', LF will be replaced by CRLF`**
   (write here)
