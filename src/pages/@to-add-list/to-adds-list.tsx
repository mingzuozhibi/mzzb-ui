import { useAppDispatch } from '#A/hooks'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { Button, Popconfirm } from 'antd'
import './to-adds-list.scss'

import { cleanToAdds } from '#F/local'
import { IDisc } from '#T/disc'
import { buildColumns } from './columns'

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
