class Page {
  constructor(path, title) {
    this.path = path
    this.title = title
  }
}

const pages = []

pages.push(new Page('/home', 'Home'))
pages.push(new Page('/sakura', 'Sakura'))

function getTitle(path) {
  const page = pages.find(p => p.path === path)
  return page != null ? page.title : pages[0].title
}

export {getTitle, pages}
