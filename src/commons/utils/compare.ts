export interface Compare<T> {
  (a: T, b: T): number
}

export function safeCompare<T, E>(
  apply: (model: T) => E | undefined,
  compare: Compare<E>,
  nullFirst = false
): Compare<T> {
  const fn = nullCompare(compare, nullFirst)
  return (a, b) => fn(apply(a), apply(b))
}

export function nullCompare<T>(compare: Compare<T>, nullFirst = false): Compare<T | undefined> {
  return (a, b) => {
    const ea = a == null
    const eb = b == null
    if (ea && eb) return 0
    if (ea || eb) return ea === nullFirst ? -1 : 1
    return compare(a!, b!)
  }
}

export function composeCompares<T>(...compares: Compare<T>[]): Compare<T> {
  return (a, b) => {
    for (const compare of compares) {
      const cmp = compare(a, b)
      if (cmp !== 0) return cmp
    }
    return 0
  }
}
