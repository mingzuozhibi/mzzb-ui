import { MyHeader } from '#C/header/MyHeader'
import { useLocation } from 'react-router-dom'

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <div className="NotFound">
      <MyHeader title="页面未找到" error={{ name: 'PATH', message: pathname }} />
    </div>
  )
}
