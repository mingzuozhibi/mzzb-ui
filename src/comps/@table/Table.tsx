import React, { useState } from 'react'
import { Button, Checkbox, Input, message, Modal } from 'antd'
import copy from 'copy-to-clipboard'
import produce from 'immer'
import classNames from 'classnames'
import { Handler } from '../../reducers/@domain'
import './Table.scss'

interface BaseRow {
  id: number
}

export interface Column<T> {
  key: string
  title: React.ReactNode
  format: (row: T, idx: number) => React.ReactNode
  tdClass?: (row: T) => string | object
  compare?: (a: T, b: T) => number
}

interface Props<T> {
  rows: T[]
  cols: Column<T>[]
  title?: React.ReactNode
  trClass?: (row: T) => string | object
  copyFmt?: (row: T, idx: number) => string
  handler?: Handler
  defaultSort?: (a: T, b: T) => number
  extraCaption?: React.ReactNode | React.ReactNodeArray
}

interface State {
  sortKey?: string
  sortAsc?: boolean
  copyMode: boolean
  selected: Set<number>
}

export function Table<T extends BaseRow>(props: Props<T>) {
  const { cols, title, handler, trClass, copyFmt, defaultSort, extraCaption } = props
  const mark = `talbe-state/${window.location.pathname}`
  const [state, setState] = useState<State>(() => {
    return loadState(mark, { copyMode: false, selected: new Set() })
  })
  const { sortKey, sortAsc, copyMode, selected } = state

  const rows = sortRows()

  return (
    <div className="table-warpper">
      {(title || copyFmt || handler || extraCaption) && renderCaption()}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            {copyMode && renderSelectTh()}
            {cols.map(col => (
              <th
                key={col.key}
                children={col.title}
                className={thClass(col)}
                onClick={col.compare && (() => thClick(col))}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id}
              id={`row-${row.id}`}
              className={trClass && classNames(trClass(row))}
              onClick={() => copyMode && doToggleRow(row.id)}
            >
              {copyMode && renderSelectTd(row.id)}
              {cols.map((col) => (
                <td key={col.key} className={tdClass(col, row)}>
                  {col.format(row, idx)}
                </td>
              ))}
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  )

  function renderSelectTh() {
    return (
      <th className="select">
        <Checkbox
          checked={selected.size === rows.length}
          onChange={e => doSelectAll(e.target.checked)}
        />
      </th>
    )
  }

  function renderSelectTd(rowId: number) {
    return (
      <td className="select">
        <Checkbox checked={selected.has(rowId)} />
      </td>
    )
  }

  function renderCaption() {
    return (
      <div className="table-caption">
        {title && (
          <span className="caption-title">{title}</span>
        )}
        {copyFmt && (
          <span className="caption-copybtn">
            {!copyMode ? renderViewButtons() : renderCopyButtons()}
          </span>
        )}
        {handler && (
          <span className="caption-refresh">
            <Button.Group>
              <Button onClick={handler.refresh} loading={handler.loading}>刷新</Button>
            </Button.Group>
          </span>
        )}
        {extraCaption && (
          <span className="caption-extra">{extraCaption}</span>
        )}
      </div>
    )
  }

  function renderViewButtons() {
    return (
      <Button.Group>
        <Button onClick={() => setCopyMode(true)}>复制</Button>
      </Button.Group>
    )
  }

  function renderCopyButtons() {
    return (
      <Button.Group>
        <Button onClick={doCopy}>复制</Button>
        <Button onClick={() => setCopyMode(false)}>取消</Button>
      </Button.Group>
    )
  }

  function sortRows() {
    const array = [...props.rows]
    if (sortKey) {
      const findCol = cols.find(col => col.key === sortKey)
      if (findCol && findCol.compare) {
        const compare = findCol.compare
        array.sort((a, b) => {
          return sortAsc ? compare(a, b) : -compare(a, b)
        })
      }
    } else if (defaultSort) {
      array.sort(defaultSort)
    }
    return array
  }

  function setCopyMode(copyMode: boolean) {
    update(draft => {
      draft.copyMode = copyMode
    })
  }

  function doCopy() {
    if (!copyFmt) {
      console.warn('call doCopy() but copyFmt is empty')
      return
    }
    let idx = 0, result: Array<String> = []
    selected.forEach(id => {
      const row = rows.find(t => t.id === id)
      row && result.push(copyFmt(row, idx++))
    })
    const resultText = result.join('\n')
    if (copy(resultText)) {
      message.success(`已复制到剪贴板，共${result.length}条数据`)
    } else {
      Modal.info({
        title: '请手动复制数据', content: (
          <Input.TextArea
            value={resultText}
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        )
      })
    }
  }

  function doToggleRow(id: number) {
    doSelectRow(id, !selected.has(id))
  }

  function doSelectRow(id: number, checked: boolean) {
    update(draft => {
      if (checked) {
        draft.selected.add(id)
        draft.selected = new Set(draft.selected)
      } else {
        draft.selected.delete(id)
        draft.selected = new Set(draft.selected)
      }
    })
  }

  function doSelectAll(checked: boolean) {
    update(draft => {
      if (checked) {
        draft.selected = new Set(rows.map(row => row.id))
      } else {
        draft.selected = new Set()
      }
    })
  }

  function thClick(col: Column<T>) {
    update(draft => {
      if (sortKey === col.key) {
        draft.sortAsc = draft.sortAsc !== true
      } else {
        draft.sortAsc = true
        draft.sortKey = col.key
      }
    })
  }

  function thClass(col: Column<T>) {
    return classNames(col.key, {
      sortable: col.compare !== undefined,
      asc: sortKey === col.key && sortAsc === true,
      desc: sortKey === col.key && sortAsc === false,
    })
  }

  function tdClass(col: Column<T>, row: T) {
    return classNames(col.key, col.tdClass && col.tdClass(row))
  }

  function update(updater: (draft: State) => void) {
    const nextState = produce(state, updater)
    setState(nextState)
    saveState(mark, nextState)
  }
}

function saveState(key: string, state: State) {
  const saveState = { ...state, selected: [...state.selected] }
  sessionStorage[key] = JSON.stringify(saveState)
}

function loadState(key: string, initState: State): State {
  const stateText = sessionStorage[key]
  const loadState = JSON.parse(stateText || '{}')
  const nextState = { ...initState, ...loadState }
  if (Array.isArray(loadState.selected)) {
    nextState.selected = new Set(loadState.selected)
  }
  return nextState
}
