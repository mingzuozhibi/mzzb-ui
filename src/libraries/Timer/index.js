import React from 'react'

class Timer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      time: this.props.time, ...this.compute()
    }
  }

  timerId = undefined

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({...this.state, ...this.compute()})
    }, this.props.timeout)
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
  }

  compute() {
    const seconds = Math.floor((new Date().getTime() - this.props.time) / 1000)
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

export default Timer
