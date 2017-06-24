/* global hexo */
/* eslint-disable object-shorthand */

const _ = require('lodash')
const Promise = require('bluebird')
const beepAndLog = require('../lib/beep')
const partial = require('../lib/tags/partial')
const note = require('../lib/tags/note')
const usageOptions = require('../lib/tags/usage')
const { issue, openAnIssue } = require('../lib/tags/issues')
const { url, urlHash } = require('../lib/tags/url')
const { fa, yields, timeout, defaultAssertion } = require('../lib/tags/icons')

const tags = {
  // partials
  partial: partial,

  // issues
  open_an_issue: openAnIssue,
  issue: issue,

  // icons
  fa: fa,
  yields: yields,
  timeout: timeout,
  default_assertion: defaultAssertion,

  // usage_options
  usage_options: usageOptions,

  // url
  url: url,
  urlHash: urlHash,
}

// tags which require ending
const endingTags = {
  // note
  note: note,
}

function promisify (fn) {
  // partial in hexo as 1st argument
  fn = _.partial(fn, hexo)

  // return higher order function
  return function () {
    // call with up hexo context
    /* eslint-disable prefer-rest-params */
    return Promise.resolve(fn.apply(this, arguments))
    .catch(beepAndLog)
  }
}

_.each(tags, (fn, key) => {
  // make all regular tags async and provide 'hexo' as the first argument
  hexo.extend.tag.register(key, promisify(fn), { async: true })
})

_.each(endingTags, (fn, key) => {
  // make all ending tags async and provide 'hexo' as the first argument
  hexo.extend.tag.register(key, promisify(fn), { async: true, ends: true })
})
