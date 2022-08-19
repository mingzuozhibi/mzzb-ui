import { Handler } from '##/@domain'
import { MzHeader } from '##/comps/header/MzHeader'
import { MzMessage } from '##/comps/message/MzMessage'
import { MzColumn, MzTable } from '##/comps/table/MzTable'
import { useLocal } from '##/hooks/useLocal'
import { InjectRole, injectRole } from '##/pages/@inject'
import { composeCompares, safeCompare } from '#U/compare'
import { isJustUpdated, isSlowUpdated } from '#U/domain'
import { formatNumber, formatTimeout } from '#U/format'
import { compareSurp, compareTitle, discTitle, formatPt } from '#P/@funcs'
import { Disc } from '#P/@types'
import { Button, Input } from 'antd'
import classNames from 'classnames'
import { Link, useHistory } from 'react-router-dom'
import './Discs.scss'

export interface IGroup {
  key: string
  title: string
  discs: Disc[]
  modifyTime?: number
}

interface Props {
  data?: IGroup
  error?: string
  handler: Handler
  lowerKey: string
}

const cols = getColumns()

const message =
  '点击复制按钮可进入复制模式，选中想要复制的碟片，然后再次点击复制即可将排名复制到剪贴板'

export default injectRole(Discs)

export function Discs(props: Props & InjectRole) {
  const { error, data: group, handler, lowerKey, isBasic } = props
  const history = useHistory()

  const [pcMode, setPcMode] = useLocal(`local-discs/${lowerKey}/pc-mode`, false)
  const [quMode, setQuMode] = useLocal(`local-discs/${lowerKey}/qu-mode`, false)
  const [query, setQuery] = useLocal(`local-discs/${lowerKey}/query`, '')

  const title = group ? group.title : '载入中'

  function onSearch(value: string) {
    setQuery(value)
  }

  let lastDiscs = group?.discs
  if (query.length > 0 && quMode === true && lastDiscs !== undefined) {
    for (const key of query.split(' ')) {
      lastDiscs = lastDiscs.filter((d) => {
        if (d.title.includes(key)) return true
        if (d.titlePc?.includes(key)) return true
        return false
      })
    }
  }

  const replace = group && (
    <>
      {group.modifyTime && <span>更新于{formatTimeout(group.modifyTime)}前</span>}
      <Button onClick={() => setPcMode(!pcMode)}>{pcMode ? '默认列' : '所有列'}</Button>
      <Button onClick={() => setQuMode(!quMode)}>{quMode ? '查询关' : '查询开'}</Button>
    </>
  )

  const extraCaption =
    group && isBasic ? (
      <span className="format">
        <Button onClick={() => history.push(`/disc_groups/${group.key}`)}>编辑列表</Button>
        <Button onClick={() => history.push(`/disc_groups/${group.key}/discs`)}>管理碟片</Button>
      </span>
    ) : null

  return (
    <div className="Discs">
      <MzMessage unikey="copymode" message={message} />
      <MzHeader header="载入中" title={title} error={error} replace={replace} />
      {group && (
        <>
          {quMode && (
            <Input.Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
              defaultValue={query}
            />
          )}
          <div className="pc-mode-warpper">
            <div className={classNames({ 'pc-mode': pcMode })}>
              <MzTable
                rows={lastDiscs!}
                cols={cols}
                title={group.title}
                handler={handler}
                extraCaption={extraCaption}
                defaultSort={createCompareRank()}
                copyFmt={(disc, idx) => {
                  return (
                    `${idx + 1})` +
                    ` ${discRank(disc)}` +
                    ` 增${disc.todayPt || 0}pt` +
                    ` 共${disc.totalPt || 0}pt` +
                    ` 预${disc.guessPt || 0}pt` +
                    ` 剩${disc.surplusDays}天` +
                    ` [${discTitle(disc)}]`
                  )
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function getColumns(): MzColumn<Disc>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (_, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: '日亚排名',
      format: formatRank,
      tdClass: tdClassRank,
      compare: createCompareRank(),
    },
    {
      key: 'addPt',
      title: '日增',
      format: (disc) => formatPt(disc.todayPt),
      compare: createComparePt((disc) => disc.todayPt),
    },
    {
      key: 'sumPt',
      title: '累积',
      format: (disc) => formatPt(disc.totalPt),
      compare: createComparePt((disc) => disc.totalPt),
    },
    {
      key: 'gusPt',
      title: '预测',
      format: (disc) => formatPt(disc.guessPt),
      compare: createComparePt((disc) => disc.guessPt),
    },
    {
      key: 'surp',
      title: '发售',
      format: (disc) => `${disc.surplusDays}天`,
      compare: composeCompares([compareSurp, compareTitle]),
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
      compare: compareTitle,
    },
  ]
}

function discRank(disc: Disc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}

function formatRank(disc: Disc) {
  return <Link to={`/discs/${disc.id}/records`}>{discRank(disc)}</Link>
}

function formatTitle(disc: Disc) {
  return <Link to={`/discs/${disc.id}`}>{discTitle(disc)}</Link>
}

function tdClassRank(disc: Disc) {
  if (isJustUpdated(disc.updateTime)) {
    return 'success'
  }
  if (isSlowUpdated(disc.updateTime)) {
    return 'warning'
  }
  return ''
}

function createCompareRank() {
  return safeCompare<Disc, number>({
    apply: (disc) => disc.thisRank,
    compare: (a, b) => a - b,
  })
}

function createComparePt(apply: (disc: Disc) => number | undefined) {
  return safeCompare<Disc, number>({ apply, compare: (a, b) => b - a })
}
