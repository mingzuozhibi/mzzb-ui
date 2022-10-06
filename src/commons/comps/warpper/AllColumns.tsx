import classNames from 'classnames'
import { ReactNode } from 'react'
import './AllColumns.scss'

interface Props {
  viewMode: string
  children: ReactNode
}

export function AllColumns(props: Props) {
  const { viewMode, children } = props
  return (
    <div className="all-columns">
      <div className={classNames({ 'view-all': viewMode === 'all' })}>{children}</div>
    </div>
  )
}
