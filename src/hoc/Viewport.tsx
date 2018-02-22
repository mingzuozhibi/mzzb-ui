import * as React from 'react'

export interface ViewportState {
  viewport?: {
    width: number
    height: number
  }
}

export function withViewport(ComposedComponent: any) {
  return class Viewport extends React.Component {
    state: ViewportState = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }

    handleWindowResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const viewport = this.state.viewport
      if (viewport!.width !== width || viewport!.height !== height) {
        this.setState({viewport: {width, height}})
      }
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleWindowResize)
      window.addEventListener('orientationchange', this.handleWindowResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize)
      window.removeEventListener('orientationchange', this.handleWindowResize)
    }

    render() {
      return <ComposedComponent {...this.props} viewport={this.state.viewport}/>
    }
  }
}
