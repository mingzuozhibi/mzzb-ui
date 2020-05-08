import { useLocation, useHistory } from "react-router-dom"
import { useState, useEffect } from "react"

interface Search {
  name: string
  init: string
}

const defaultSearchs = [
  { name: 'page', init: '1' },
  { name: 'size', init: '20' },
]

export function useSearch(extra: Search[]) {
  const history = useHistory()
  const location = useLocation()
  const searchs = [...defaultSearchs, ...extra]
  const params = new URLSearchParams(location.search)
  const [query, setQuery] = useState(createQuery(searchs, params))

  useEffect(() => {
    if (createQuery(searchs, params) !== query) {
      setTimeout(() => {
        history.push(`${location.pathname}?${query}`)
      })
    }
  }, [query, history, location.pathname])

  const getParam = (name: string) => {
    return params.get(name) || searchs.find(e => e.name === name)?.init
  }
  const setParam = (name: string, value: string) => {
    if (value !== searchs.find(e => e.name === name)?.init) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    setQuery(createQuery(searchs, params))
  }
  return { query, getParam, setParam }
}

function createQuery(searchs: Search[], params: URLSearchParams) {
  const querys = Array<String>()
  for (const search of searchs) {
    const value = params.get(search.name)
    if (value !== null && value !== search.init) {
      querys.push(`${search.name}=${value}`)
    }
  }
  return querys.join('&')
}
