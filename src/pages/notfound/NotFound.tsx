import { MzTopbar } from '#C/topbar/MzTopbar'
import { useLocation } from 'react-router-dom'

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <div className="NotFound">
      <MzTopbar title="页面未找到" error={`地址：${pathname}`} />
    </div>
  )
}
