export class UrlBuilder {
  hasParam: boolean
  pathname: string
  searchParams: URLSearchParams

  constructor(pathname: string) {
    this.hasParam = false
    this.pathname = pathname
    this.searchParams = new URLSearchParams()
  }

  append(name: string, value?: string | number) {
    if (value == null) return this
    if (typeof value === 'string' && value.length > 0) {
      this.hasParam = true
      this.searchParams.append(name, value)
    }
    if (typeof value === 'number') {
      this.hasParam = true
      this.searchParams.append(name, value.toString())
    }
    return this
  }

  toString() {
    if (this.hasParam) {
      return `${this.pathname}?${this.searchParams.toString()}`
    } else {
      return `${this.pathname}`
    }
  }
}
