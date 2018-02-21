import * as React from 'react'
import { AppContext, AppState, default as App } from '../App'
import produce from 'immer'
import { BaseModel, Result } from '../utils/manager'
import { Modal } from 'antd'

export interface State<M extends BaseModel> {
  models?: M[]
  errors?: string
}

export class BaseComponent<M extends BaseModel, S extends State<M>> extends React.Component {

  static contextTypes = App.childContextTypes

  context: AppContext

  listModel: () => void

  listModelSupport = (fetch: () => Promise<Result<M[]>>) => {
    this.listModel = async () => {
      this.context.update((draft: AppState) => {
        draft.reload!.pending = true
      })

      const result = await fetch()

      this.update(draft => {
        if (result.success) {
          draft.models = result.data
          draft.errors = undefined
        } else {
          draft.errors = result.message
        }
      })

      this.context.update((draft: AppState) => {
        draft.reload!.pending = false
      })
    }
  }

  saveModel = (message: string, result: Result<M>) => {
    if (result.success) {
      this.update(draft => draft.models!.push(result.data))
    } else {
      Modal.error({title: message, content: result.message})
    }
  }

  editModel = (message: string, result: Result<M>) => {
    if (result.success) {
      const model = result.data
      this.update(draft => {
        draft.models = draft.models!.map(u => u.id === model.id ? model : u)
      })
    } else {
      Modal.error({title: message, content: result.message})
    }
  }

  update = (reducer: (draft: S) => void) => {
    this.setState((prevState => produce(prevState, reducer)))
  }

  componentDidMount() {
    this.context.update((draft: AppState) => {
      draft.reload = {pending: true, handle: this.listModel}
    })

    this.listModel()
  }

}
