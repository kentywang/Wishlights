import React, { Component } from 'react';
import buildGame from '../game'

export default class Application extends Component{
  constructor (props) {
    super(props);

    this.state = {
      loaded: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({loaded: true});

    setTimeout(buildGame, 0); // find better approach
  }

  render() {
    return (
      <div>
        {
          !this.state.loaded ?
          <div onClick={this.handleClick}>
          Wish!
          </div> :
          <div id="vr" />
        }
      </div>
    );
  }
}