const header = 'X-CSRF-HEADER'
const token = 'X-CSRF-TOKEN'

function prepareCookies({credentials, ...props}: RequestInit) {
  if (!credentials) {
    credentials = 'include'
  }
  return {credentials, ...props}
}

function prepareHeaders({headers = {}, ...prors}: RequestInit) {
  const name = sessionStorage[header]
  const value = sessionStorage[token]
  if (name && value) {
    headers[name] = value
  }
  if (prors.body) {
    headers['Content-Type'] = 'application/json;charset=UTF-8'
  }
  return {headers, ...prors}
}

function saveCsrfToken(response: Response) {
  const headers = response.headers
  sessionStorage[header] = headers.get(header)
  sessionStorage[token] = headers.get(token)
  return response
}

function parseToJSON(response: Response) {
  try {
    return response.json()
  } catch (error) {
    throw new Error(`服务器未正确响应: ${response.status}: ${response.statusText}`)
  }
}

export default function request(url: string, props: RequestInit = {}) {
  props = prepareCookies(props)
  props = prepareHeaders(props)
  return fetch(url, props)
    .then(saveCsrfToken)
    .then(parseToJSON)
    .catch(err => {
      return {success: false, message: err.message}
    })
}
