analyticsImport.init()
breadcrumbsImport.init()

if (helpersImport.isPage('app-page--results')) {
  resultsImport.short()
}

if (helpersImport.isPage('app-page--results-long')) {
  if (document.body.clientWidth >= 768) {
    resultsImport.cardHeight()
  }
  resultsImport.long()
}
