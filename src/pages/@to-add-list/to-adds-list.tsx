import { useAppDispatch } from '#A/hooks'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import './to-adds-list.scss'

import { linkToDisc } from '#A/links'
import { cleanToAdds } from '#F/local'
import { IDisc } from '#T/disc'
import { compareRelease, compareTitle, discTitle } from '#T/disc-utils'

interface Props {
  toAdds: IDisc[]
  column: MzColumn<IDisc>
}

export function ToAddsList(props: Props) {
  const dispatch = useAppDispatch()
  const cols = buildColumns(props.column)

  return (
    <div className="to-adds-list">
      <MzTable
        tag="toadds"
        rows={props.toAdds}
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
