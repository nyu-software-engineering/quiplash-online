import React from 'react';
import './waiting.css';
// import "../games/Timer.js";
import {Button} from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import socket, { getPlayers, subscribeToJoins, startGame } from '../../utils/api'

class WaitingPrivate extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      errorText: "",
      prompts: []
    }
    this.receivedPlayers.bind(this);
    subscribeToJoins((err, players) => {
      if (!err) {
        this.receivedPlayers(players)
      }
    })
  }
  receivedPlayers(players){
    this.setState({players: players})
  }
  
  startPrivateGame(){
    startGame(this.props.roomCode, res => {
      const {msg, prompts} = res
      if(msg !== 'true'){
        // this.setState({prompts: prompts})
        // this.setState({errorText: ""})
        // console.log("YAY, START THE GAME WITH: " + prompts);
        this.setState({errorText: "You either don't have enough players or are sending an incorrect code. Please try again."});
      }
      else{
        this.props.history.push({
          pathname: "/answer/private",
          state: {
            prompts
          }
        })
      }
    })
  }
  componentDidMount(){
    const { roomCode } = this.props
    getPlayers(roomCode, (players) => {
      this.receivedPlayers(players)
    })
    startGame(this.props.roomCode, res => {
      const {msg, prompts} = res
      this.setState({prompts: prompts})
      // console.log("YAY, START THE GAME WITH: " + prompts);
    })
  }
  
  componentWillUnmount(){
    socket.off('join-private-room')
    socket.off('start-game')
  }
  render(){
    const { players } = this.state
    return(
      <>
        <div id="waitingPrivate">
          <div id="heading">
            <h1>{this.props.roomName}</h1>
            <h2 id="code">Room Code: {this.props.roomCode}</h2>
              <h2 id="time">Timer: <span id="timer"></span> </h2>
          </div>
          <div id="players">
            {players.map(p => (
              <h3 key={p}>Player Name: {p}</h3>
            ))}
          </div>
          <div>{this.state.errorText}</div>
          <Button variant="primary" type="submit" onClick={this.startPrivateGame.bind(this)}>Start the Game!</Button>
        </div>
      </>
    )
  }
}

export default withRouter(WaitingPrivate)
