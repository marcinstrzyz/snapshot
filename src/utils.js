/* global Cypress */
const sd = require('@wildpeaks/snapshot-dom')

function isJqueryElement (x) {
  return 'wrap' in x
}

// converts DOM element to a JSON object
function serializeDomElement ($el) {
  // console.log('snapshot value!', $el)
  const json = sd.toJSON($el.context)
  // remove React id, too transient
  delete json.attributes['data-reactid']
  // console.log('as json', json)

  // hmm, why is value not serialized?
  if ($el.context.value && !json.attributes.value) {
    json.attributes.value = $el.context.value
  }

  return json
}

const stripReactIdAttributes = html => {
  const dataReactId = /data\-reactid="[\.\d\$\-abcdfef]+"/g
  return html.replace(dataReactId, '')
}

const serializeReactToHTML = el$ => {
  debugger
  const html = el$[0].outerHTML
  const stripped = stripReactIdAttributes(html)
  return stripped
}

const identity = x => x

const publicProps = name => !name.startsWith('__')

const countSnapshots = snapshots =>
  Object.keys(snapshots).filter(publicProps).length

module.exports = {
  SNAPSHOT_FILE_NAME: 'snapshots.js',
  serializeDomElement,
  serializeReactToHTML,
  identity,
  countSnapshots,
  isJqueryElement
}