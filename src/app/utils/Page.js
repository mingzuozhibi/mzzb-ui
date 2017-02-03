class Page {
  constructor(href, name) {
    this.href = href;
    this.name = name;
  }
}

function allPages() {
  return [
    new Page("/home", "Home"),
    new Page("/sakura", "Sakura"),
    new Page("/disclist", "DiscList"),
    new Page("/mystared", "MyStared"),
    new Page("/setting", "Setting"),
    new Page("/about", "About"),
  ]
}

function activePage(router) {
  const pageArray = allPages();
  for (const page of pageArray) {
    if (router.isActive(page.href)) {
      return page;
    }
  }
  return pageArray[0];
}

export {allPages, activePage};
