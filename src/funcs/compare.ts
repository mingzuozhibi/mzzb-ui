interface Compare<T> {
  (a: T, b: T): number
}

interface Props<T, U> {
  apply: (model: T) => U | undefined
  empty?: (value?: U) => boolean
  compare: Compare<U>
}

export function safeCompare<T, U>(props: Props<T, U>) {
  const defaultEmptyFunc = (e?: U) => e === undefined
  const { apply, empty = defaultEmptyFunc, compare } = props
  return (a: T, b: T) => {
    const valueA = apply(a)
    const valueB = apply(b)
    const emptyA = empty(valueA)
    const emptyB = empty(valueB)
    if (emptyA && emptyB) return 0
    if (emptyA || emptyB) return emptyA ? 1 : -1
    return compare(valueA!, valueB!)
  }
}

export function composeCompares<T>(compares: Compare<T>[]): Compare<T> {
  return (a: T, b: T) => {
    for (const compare of compares) {
      const c = compare(a, b)
      if (c !== 0) return c
    }
    return 0
  }
}
