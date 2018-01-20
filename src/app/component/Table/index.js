import Table from './Table'

class Column {
  constructor({className, compare, format, style = {}, title}) {
    this.className = className
    this.compare = compare
    this.format = format
    this.style = style
    this.title = title
  }
}

export default Table

export {Column}
