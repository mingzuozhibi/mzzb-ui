import { useAppDispatch, useAppSelector } from '#A/hooks'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { thenCompare } from '#U/compare'
import { Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import './to-adds-table.scss'

import { linkToDisc } from '#A/links'
import { cleanToAdds, dropToAdds } from '#F/local'
import { IDisc } from '#T/disc'
import { discTitle } from '#T/disc-utils'
import { DeleteOutlined } from '@ant-design/icons'

export function ToAddsTable() {
  const dispatch = useAppDispatch()
  const toAdds = useAppSelector((state) => state.local.toAdds)
  const cols = buildColumns({
    key: 'command',
    title: '移除',
    format: (row: IDisc) => <DeleteOutlined onClick={() => dispatch(dropToAdds(row))} />,
  })

  return (
    <div className="to-adds-table">
      <MzTable
        tag="toadds"
        rows={toAdds}
        cols={cols}
        title="待选列表"
        extraCaption={
          <Popconfirm
            title="确定要清空待选列表吗？"
            okText="Yes"
            cancelText="No"
            onConfirm={() => dispatch(cleanToAdds())}
          >
            <Button>清空</Button>
          </Popconfirm>
        }
      />
    </div>
  )
}

function buildColumns(extraColumn: MzColumn<IDisc>): MzColumn<IDisc>[] {
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

const compareRelease = thenCompare<IDisc>(compareSurplus, compareTitle)

function compareSurplus(a: IDisc, b: IDisc) {
  return b.surplusDays - a.surplusDays
}

function compareTitle(a: IDisc, b: IDisc) {
  return discTitle(a).localeCompare(discTitle(b))
}
