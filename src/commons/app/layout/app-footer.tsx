import { MzLink } from '#CC/link/MzLink'
import { Layout } from 'antd'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function AppFooter() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scroll(0, 0)
  }, [pathname])
  return (
    <Layout.Footer className="app-footer">
      <div id="beian" style={{ textAlign: 'center' }}>
        <MzLink href="http://beian.miit.gov.cn" title="鲁ICP备16016069号-1" />
      </div>
    </Layout.Footer>
  )
}
