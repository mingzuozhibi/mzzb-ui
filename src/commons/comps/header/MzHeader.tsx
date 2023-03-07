import { RefreshButton } from '#CC/button/Refresh'
import { MzDropdown, MzItem } from '#CC/dropdown/MzDropdown'
import { useTitle } from '#CH/useTitle'
import { safeWarpper } from '#CU/empty'
import { IState } from '#DT/result'

import { PageHeader, PageHeaderProps } from '@ant-design/pro-layout'
import { Alert } from 'antd'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import './MzHeader.scss'

type ExcludedUnion = 'title' | 'extra'

interface Props extends Omit<PageHeaderProps, ExcludedUnion> {
  title?: string | { prefix: string; suffix?: string }
  state?: IState
  error?: string
  items?: MzItem[]
  extra?: ReactNode[]
}

export function MzHeader(props: Props) {
  const { title, state, error, items, extra, ...otherProps } = props

  let lastTitle = findTitle(title)

  useTitle(lastTitle)

  const lastExtra = extra ? [...extra] : []

  if (state) {
    lastExtra.unshift(<RefreshButton key="H1" state={state} />)
  }

  if (items) {
    lastExtra.push(<MzDropdown key="H2" label="功能" children={items} />)
  }

  const navigate = useNavigate()
  const lastProps: PageHeaderProps = {
    onBack: () => navigate(-1),
    style: { padding: 8 },
    ...otherProps,
  }

  const message = error ?? state?.error?.message
  const extraCls = classNames({ 'refresh-only': lastExtra.length === 1 && state != null })

  return (
    <div className="MzHeader">
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
