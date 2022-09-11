import { useAppDispatch, useAppSelector } from '#A/hooks'
import { MzLink } from '#C/link/MzLink'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useOnceService } from '#H/useOnce'
import { safeWarpper } from '#U/domain'
import { DeleteOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

import { linkToAmazonDeatil } from '#A/links'
import { dropToAdds } from '#F/local'
import { IComing, IDisc } from '#T/disc'
import { ToAddsList } from '../@to-add-list/to-adds-list'
import { ToAddsTabs } from '../@to-add-list/to-adds-tabs'

export default function DiscAdd() {
  useOnceService(() => {
    window.scroll(0, 0)
  })

  const location = useLocation()
  const coming = location.state as IComing | undefined
  const amazonUrl = safeWarpper(coming?.asin, (asin) => (
    <MzLink href={linkToAmazonDeatil(asin)} title="点击打开日亚页面" />
  ))

  const dispatch = useAppDispatch()
  const toAdds = useAppSelector((state) => state.local.toAdds)
  const column = {
    key: 'command',
    title: '移除',
    format: (row: IDisc) => <DeleteOutlined onClick={() => dispatch(dropToAdds(row))} />,
  }

  return (
    <div className="DiscAdd" style={{ maxWidth: 650 }}>
      <MzTopbar title="待选列表" subTitle={amazonUrl} />
      <ToAddsTabs toAdds={toAdds} coming={coming} />
      <ToAddsList toAdds={toAdds} column={column} />
    </div>
  )
}
