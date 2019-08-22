function prepareCookies({credentials, ...props}: RequestInit) {
  if (!credentials) {
    credentials = 'include'
  }
  return {credentials, ...props}
}

function prepareHeaders({headers = {}, ...prors}: RequestInit) {
  const name = sessionStorage['X-CSRF-HEADER']
  const value = sessionStorage['X-CSRF-TOKEN']
  if (name && value) {
    // @ts-ignore
    headers[name] = value
  }
  if (prors.body) {
    // @ts-ignore
    headers['Content-Type'] = 'application/json;charset=UTF-8'
  }
  return {headers, ...prors}
}

function checkStatus(response: Response) {
  if (!response.ok) {
    if (response.status === 502) {
      throw new Error(`服务器可能正在重启，请过一分钟再试。`)
    } else {
      throw new Error(`服务器未正确响应: ${response.status}: ${response.statusText}`)
    }
  }
  return response
}

function saveOfToken(response: Response) {
  const headers = response.headers
  sessionStorage['X-CSRF-HEADER'] = headers.get('X-CSRF-HEADER')
  sessionStorage['X-CSRF-TOKEN'] = headers.get('X-CSRF-TOKEN')
  if (headers.has('X-AUTO-LOGIN')) {
    localStorage['X-AUTO-LOGIN'] = headers.get('X-AUTO-LOGIN')
  }
  return response
}

function parseToJSON(response: Response) {
  try {
    return response.json()
  } catch (err) {
    throw new Error(`错误的JSON格式, error=${err.message}, text=${response.text()}`)
  }
}

function handleError(error: Error) {
  return {success: false, message: error.message}
}

type Result = { success: true, [extraProps: string]: any } | { success: false, message: string }

export default function request(url: string, props: RequestInit = {}): Promise<Result> {
  url = url.replace('??', '?')
  props = prepareCookies(props)
  props = prepareHeaders(props)
  return fetch(url, props)
    .then(checkStatus)
    .then(saveOfToken)
    .then(parseToJSON)
    .catch(handleError)
}
