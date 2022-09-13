import { RefreshButton } from '#C/button/Refresh'
import { useTitle } from '#H/useTitle'
import { IState } from '#T/result'
import { safeWarpper } from '#U/domain'
import { Alert, PageHeader, PageHeaderProps } from 'antd'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import './MzTopbar.scss'

type ExcludedUnion = 'title' | 'extra'

interface Props extends Omit<PageHeaderProps, ExcludedUnion> {
  title?: string | { prefix: string; suffix?: string }
  state?: IState
  error?: string
  extra?: ReactNode[]
}

export function MzTopbar(props: Props) {
  const { title, state, error, extra, ...otherProps } = props

  let lastTitle = findTitle(title)

  useTitle(lastTitle)

  const button = safeWarpper(state, (state) => {
    return <RefreshButton key="R1" state={state} />
  })
  const lastExtra = extra ? [button, ...extra] : [button]

  const navigate = useNavigate()
  const lastProps: PageHeaderProps = {
    onBack: () => navigate(-1),
    style: { padding: 8 },
    ...otherProps,
  }

  const message = error ?? state?.error?.message
  const extraCls = classNames({ 'refresh-only': extra == null && state != null })

  return (
    <div className="MzTopbar">
      <div className={extraCls}>
        <PageHeader title={lastTitle} extra={lastExtra} {...lastProps} />
      </div>
      {safeWarpper(message, (message) => {
        return <Alert type="error" message={message} style={{ marginBottom: 8 }} />
      })}
    </div>
  )
}

function findTitle(title: Props['title']) {
  if (title == null) {
    return '载入中'
  } else if (typeof title === 'string') {
    return title
  } else {
    return `${title.prefix}：${title.suffix || '载入中'}`
  }
}
