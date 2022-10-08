import { useAppDispatch, useAppSelector } from '#CA/hooks'
import { MzHeader } from '#CC/header/MzHeader'
import { DeleteOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

import { dropToAdds } from '#DF/local'
import { IComing, IDisc } from '#DT/disc'
import { ToAddsList } from '#RC/@to-add-list/to-adds-list'
import { ToAddsTabs } from '#RC/@to-add-list/to-adds-tabs'
import { MzColumn } from '#CC/table/MzTable'

export default function DiscAdd() {
  const location = useLocation()
  const coming = location.state as IComing | undefined

  const dispatch = useAppDispatch()
  const toAdds = useAppSelector((state) => state.local.toAdds)
  const column: MzColumn<IDisc> = {
    key: 'command',
    title: '移除',
    format: () => <DeleteOutlined />,
    tdClick: (row) => dispatch(dropToAdds(row)),
  }

  return (
    <div className="DiscAdd" style={{ maxWidth: 650 }}>
      <MzHeader title="待选列表" />
      <ToAddsTabs toAdds={toAdds} coming={coming} />
      <ToAddsList toAdds={toAdds} column={column} />
    </div>
  )
}
