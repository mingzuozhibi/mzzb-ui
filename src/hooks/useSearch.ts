import { useLocation, useHistory } from "react-router-dom"

interface Search {
  name: string
  init: string
}

const defaultSearchs = [
  { name: 'page', init: '1' },
  { name: 'size', init: '20' },
]

export function useSearch(extra: Search[]) {
  const location = useLocation()
  const searchs = [...defaultSearchs, ...extra]

  const params = createParams(location.search)
  const search = createSearch(searchs, params)

  const history = useHistory()

  const pushPath = () => {
    history.push(`${location.pathname}?${createSearch(searchs, params)}`)
  }

  const getParam = (name: string) => {
    return params.get(name) || searchs.find(e => e.name === name)?.init
  }

  const setParam = (name: string, value: string) => {
    if (value !== searchs.find(e => e.name === name)?.init) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
  }

  return { search, pushPath, getParam, setParam }
}

function createParams(search: string) {
  return new URLSearchParams(search)
}

function createSearch(searchs: Search[], params: URLSearchParams) {
  const querys = Array<String>()
  for (const search of searchs) {
    const value = params.get(search.name)
    if (value !== null && value !== search.init) {
      querys.push(`${search.name}=${value}`)
    }
  }
  return querys.join('&')
}
