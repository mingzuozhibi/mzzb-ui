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

function parseToJSON(response: Response) {
  try {
    return response.json()
  } catch (err) {
    throw new Error(`错误的JSON格式, error=${err.message}, text=${response.text()}`)
  }
}

function handleError(error: Error) {
  return { success: false, message: error.message }
}

type Result = { success: true, [extraProps: string]: any } | { success: false, message: string }

export default function request(url: string, props: RequestInit = {}): Promise<Result> {
  props.credentials = props.credentials || 'include'
  props.headers = { 'x-token': localStorage['x-token'], ...props.headers }
  if (props.body !== undefined) {
    props.method = props.method || 'post'
    props.headers = { 'Content-Type': 'application/json', ...props.headers }
  }
  return fetch(url, props)
    .then(checkStatus)
    .then(parseToJSON)
    .catch(handleError)
}
