const CONTENT_TYPE_NAME = 'Content-Type'
const CONTENT_TYPE_VALUE = 'application/jsoncharset=UTF-8'

const CSRF_HEADER_KEY = 'X-CSRF-HEADER'
const CSRF_PARAM_KEY = 'X-CSRF-PARAM'
const CSRF_TOKEN_KEY = 'X-CSRF-TOKEN'

function prepareSession({credentials, ...props}) {
  if (!credentials) {
    credentials = 'include'
  }
  return {credentials, ...props}
}

function prepareBodyData({body, headers = {}, ...props}) {
  if (body) {
    headers[CONTENT_TYPE_NAME] = CONTENT_TYPE_VALUE
    body = JSON.stringify(body)
  }
  return {body, headers, ...props}
}

function prepareCsrfToken({method = 'get', headers = {}, ...prors}) {
  if (method.toLowerCase() !== 'get') {
    const headerName = sessionStorage[CSRF_HEADER_KEY]
    const headerValue = sessionStorage[CSRF_TOKEN_KEY]
    if (headerName && headerValue) {
      headers[headerName] = headerValue
    } else {
      throw new Error('Abnormal Login Status')
    }
  }
  return {method, headers, ...prors}
}

function checkStatus(response) {
  if (response.status < 200 || response.status > 300) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return response
}

function saveCsrfToken(response) {
  const headers = response.headers
  sessionStorage[CSRF_HEADER_KEY] = headers.get(CSRF_HEADER_KEY)
  sessionStorage[CSRF_PARAM_KEY] = headers.get(CSRF_PARAM_KEY)
  sessionStorage[CSRF_TOKEN_KEY] = headers.get(CSRF_TOKEN_KEY)
  return response
}

function parseToJSON(response) {
  const headers = response.headers
  const contentType = headers.get(CONTENT_TYPE_NAME)
  try {
    return response.json()
  } catch (error) {
    throw new Error(`Parse JSON: ContentType=${contentType} Message: ${error.message}`)
  }
}

function ajax(url, props = {}) {
  props = prepareSession(props)
  props = prepareBodyData(props)
  props = prepareCsrfToken(props)
  return fetch(url, props)
    .then(checkStatus)
    .then(saveCsrfToken)
    .then(parseToJSON)
}

export default ajax
