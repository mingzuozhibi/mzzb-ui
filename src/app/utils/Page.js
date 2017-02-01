const contentPages = {
  "/home": "Home",
  "/sakura": "Sakura",
  "/disclist": "DiscList",
  "/mystared": "MyStared",
  "/setting": "Setting",
  "/about": "About",
};

function getCurrentTitle(router) {
  for (const [pathName, pageTitle] of Object.entries(contentPages)) {
    if (router.isActive(pathName)) {
      return pageTitle;
    }
  }
  return "Home";
}

exports.contentPages = contentPages;
exports.getCurrentTitle = getCurrentTitle;
