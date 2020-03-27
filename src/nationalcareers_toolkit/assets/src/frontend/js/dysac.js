analytics.init()
breadcrumbs.init()

if (helpers.isPage('app-page--results')) {
  results.short()
}

if (helpers.isPage('app-page--results-long')) {
  if (document.body.clientWidth >= 768) {
    results.cardHeight()
  }
  results.long()
}
