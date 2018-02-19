import * as React from 'react'
import { MouseEventHandler } from 'react'

interface LinkProps {
  onClick: MouseEventHandler<HTMLAnchorElement>
}

export class Link extends React.Component<LinkProps, {}> {
  render() {
    return (
      <a style={{cursor: 'pointer'}} onClick={this.props.onClick}>
        {this.props.children}
      </a>
    )
  }
}
