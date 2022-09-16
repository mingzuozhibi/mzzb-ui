import { useAppDispatch, useAppSelector } from '#A/hooks'
import { MzHeader } from '#C/header/MzHeader'
import { DeleteOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

import { dropToAdds } from '#F/local'
import { IComing, IDisc } from '#T/disc'
import { ToAddsList } from '../@to-add-list/to-adds-list'
import { ToAddsTabs } from '../@to-add-list/to-adds-tabs'

export default function DiscAdd() {
  const location = useLocation()
  const coming = location.state as IComing | undefined

  const dispatch = useAppDispatch()
  const toAdds = useAppSelector((state) => state.local.toAdds)
  const column = {
    key: 'command',
    title: '移除',
    format: (row: IDisc) => <DeleteOutlined onClick={() => dispatch(dropToAdds(row))} />,
  }

  return (
    <div className="DiscAdd" style={{ maxWidth: 650 }}>
      <MzHeader title="待选列表" />
      <ToAddsTabs toAdds={toAdds} coming={coming} />
      <ToAddsList toAdds={toAdds} column={column} />
    </div>
  )
}
