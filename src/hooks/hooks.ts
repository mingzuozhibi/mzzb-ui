import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} - mingzuozhibi.com`
  }, [title])
}

export function useClientWidth(selector: string) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => setWidth(document.querySelector(selector)!.clientWidth)
    const handleWindowResize = debounce(updateWidth, 100, {leading: true, maxWait: 200})

    updateWidth()

    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('orientationchange', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener('orientationchange', handleWindowResize)
    }
  }, [selector])

  return width
}
