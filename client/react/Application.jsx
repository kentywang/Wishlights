import React, {Component} from 'react';

export default class Application extends Component(){
  constructor (props) {
    super(props);

    this.state = {
      loaded: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({loaded: true});
  }

  render() {
    return (
      <div>
        {
          !this.state.loaded ?
          <div onClick={this.handleClick}>
          Aiya
          </div> :
          null
        }
        { this.state.loaded ? <div id="vr" /> : null }
      </div>
    );
  }
}