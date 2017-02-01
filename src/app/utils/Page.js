const contentPages = {
  '/home': 'Home',
  '/sakura': 'Sakura',
  '/disclist': 'DiscList',
  '/mystared': 'MyStared',
  '/setting': 'Setting',
  '/about': 'About',
};

function getCurrentTitle(router) {
  for (let pathname in contentPages) {
    if (router.isActive(pathname)) {
      return contentPages[pathname]
    }
  }
  return 'Home';
}

exports.contentPages = contentPages;
exports.getCurrentTitle = getCurrentTitle;
