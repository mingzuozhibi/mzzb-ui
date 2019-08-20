interface CompareProps<T, E> {
  apply: (model: T) => E | undefined
  empty: (value?: E) => boolean
  compare: (a: E, b: E) => number
}

export const compareFactory = <T, E>(props: CompareProps<T, E>) => {
  const { apply, empty, compare } = props
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
