import React from 'react'

interface TimerProps {
  time: number
  timeout: number
  render: (state: TimerState) => React.ReactNode
}

interface TimerState {
  time: number
  hour: number
  minute: number
  second: number
}

export class Timer extends React.Component<TimerProps, TimerState> {

  state: TimerState = {
    time: this.props.time, ...this.compute()
  }

  timer: any

  componentDidMount() {
    const handler = () => {
      this.setState({...this.state, ...this.compute()})
    }
    this.timer = setInterval(handler, this.props.timeout)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  compute() {
    const current = new Date().getTime()
    const seconds = Math.floor((current - this.props.time) / 1000)
    const minutes = Math.floor(seconds / 60)
    return {
      hour: Math.floor(minutes / 60),
      minute: Math.floor(minutes % 60),
      second: Math.floor(seconds % 60),
    }
  }

  render() {
    return this.props.render(this.state)
  }
}
