import React from 'react'

interface ViewportState {
  viewport: {
    width: number
    height: number
  }
}

export type ViewportProps = ViewportState

export function withViewport<P>(ComposedComponent: any) {
  return class Viewport extends React.Component<P, ViewportState> {
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
      if (viewport.width !== width || viewport.height !== height) {
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
