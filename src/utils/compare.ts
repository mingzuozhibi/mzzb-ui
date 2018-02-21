interface CompareProps<T, E> {
  apply: (model: T) => E
  check: (value: E) => boolean
  compare: (a: E, b: E) => number
}

export const compareFactory = <T, E>(props: CompareProps<T, E>) => {
  return (a: T, b: T) => {
    const valueA = props.apply(a)
    const valueB = props.apply(b)
    const emptyA = props.check(valueA)
    const emptyB = props.check(valueB)
    if (!emptyA && !emptyB) {
      return props.compare(valueA, valueB)
    } else {
      return emptyA && emptyB ? 0 : emptyA ? 1 : -1
    }
  }
}
