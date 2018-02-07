export function compareFactory({compare, isEmpty = () => false}) {
  return (a, b) => {
    const is_empty_a = isEmpty(a)
    const is_empty_b = isEmpty(b)
    if (is_empty_a && is_empty_b) {
      return 0
    }
    if (is_empty_a || is_empty_b) {
      return is_empty_a ? 1 : -1
    }
    return compare(a, b)
  }
}
