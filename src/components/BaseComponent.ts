import * as React from 'react'
import { AppContext, AppState, default as App } from '../App'
import produce from 'immer'

export class BaseComponent<State> extends React.Component<{}, State> {

  static contextTypes = App.childContextTypes

  context: AppContext

  appState: AppState = this.context.state

  protected listModels: () => void

  update = (reducer: (draft: State) => void) => {
    this.setState((prevState => produce(prevState, reducer)))
  }

  componentDidMount() {
    this.context.update((draft: AppState) => {
      draft.reload = {pending: true, handle: this.listModels}
    })

    this.listModels()
  }

  componentWillUpdate() {
    this.appState = this.context.state
  }

}
