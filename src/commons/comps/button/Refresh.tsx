import { IState } from '#DT/result'
import { Button } from 'antd'

interface Props {
  state: IState
}

export function RefreshButton(props: Props) {
  const { state } = props
  return (
    <Button loading={state.loading} onClick={state.refresh}>
      刷新
    </Button>
  )
}
