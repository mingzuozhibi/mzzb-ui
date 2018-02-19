import * as React from 'react'

export class Home extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div id="home-root">
        <h3>Welcome!</h3>
      </div>
    )
  }
}
