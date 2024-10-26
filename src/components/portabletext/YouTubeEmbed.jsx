import React, { Component } from 'react'
import YouTubePlayer from 'react-player/youtube'

class YouTubeEmbed extends Component {
  render() {
    console.log(this.props.node.url)
    return (
        <YouTubePlayer url={this.props.node.url} controls={true} />
    )
  }
}

export default YouTubeEmbed;