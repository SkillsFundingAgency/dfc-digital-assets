const helpersImport = require('./dysac_modules/helpers.js')
const resultsImport = require('./dysac_modules/results.js')
const analyticsImport = require('./dysac_modules/analytics.js')
const breadcrumbsImport = require('./dysac_modules/breadcrumbs.js')
const GOVUKFrontendImport = require('govuk-frontend')

GOVUKFrontendImport.initAll()
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
