interface Compare<T> {
  (a: T, b: T): number
}

interface Props<T, E> {
  apply: (model: T) => E | undefined
  empty?: (value?: E) => boolean
  compare: Compare<E>
}

export function safeCompare<T, E>(props: Props<T, E>) {
  const defaultEmptyFunc = (e?: E) => e === undefined
  const {apply, empty = defaultEmptyFunc, compare} = props
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

export function composeCompares<T>(compares: Compare<T>[]) {
  return (a: T, b: T) => {
    for (const compare of compares) {
      const c = compare(a, b)
      if (c !== 0) return c
    }
    return 0
  }
}
