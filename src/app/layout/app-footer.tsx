import { MzLink } from '#C/link/MzLink'
import { Layout } from 'antd'

export function AppFooter() {
  return (
    <Layout.Footer className="app-footer">
      <div id="beian" style={{ textAlign: 'center' }}>
        <MzLink href="http://beian.miit.gov.cn" title="鲁ICP备16016069号-1" />
      </div>
    </Layout.Footer>
  )
}
