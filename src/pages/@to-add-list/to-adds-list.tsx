import { useAppDispatch } from '#A/hooks'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { Button, Popconfirm, Space } from 'antd'
import { Link } from 'react-router-dom'
import './to-adds-list.scss'

import { linkToDisc } from '#A/links'
import { cleanToAdds, reoladToAdds } from '#F/local'
import { IDisc } from '#T/disc'
import { compareRelease, compareTitle, discTitle } from '#T/disc-utils'

interface Props {
  toAdds: IDisc[]
  column: MzColumn<IDisc>
}

export function ToAddsList(props: Props) {
  const { toAdds, column } = props
  const cols = buildColumns(column)

  const dispatch = useAppDispatch()
  const extra = (
    <Space>
      <Popconfirm
        title="确定要清空待选列表吗？"
        okText="Yes"
        cancelText="No"
        onConfirm={() => dispatch(cleanToAdds())}
      >
        <Button>清空</Button>
      </Popconfirm>
      <Popconfirm
        title="确定要刷新待选列表吗？"
        okText="Yes"
        cancelText="No"
        onConfirm={() => dispatch(reoladToAdds())}
      >
        <Button>刷新</Button>
      </Popconfirm>
    </Space>
  )
  return (
    <div className="to-adds-list">
      <MzTable tag="toadds" rows={toAdds} cols={cols} title="待选列表" extraCaption={extra} />
    </div>
  )
}

export function buildColumns(extraColumn: MzColumn<IDisc>): MzColumn<IDisc>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (row) => row.asin,
      compare: (a, b) => a.asin.localeCompare(b.asin),
    },
    {
      key: 'release',
      title: '天数',
      format: (row) => `${row.surplusDays}天`,
      compare: compareRelease,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (row) => <Link to={linkToDisc(row.id)}>{discTitle(row)}</Link>,
      compare: compareTitle,
    },
    extraColumn,
  ]
}
