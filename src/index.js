import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function secsToDHMS(n) {
    let day = Math.floor(parseInt( n / (24 * 3600)));

    n = n % (24 * 3600);
    let hour = Math.floor(parseInt(n / 3600));

    n %= 3600;
    let minutes = Math.floor(n / 60);

    n %= 60;
    let seconds = Math.floor(n);
    
    return [day,hour,minutes,seconds]
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        let dhms = secsToDHMS(Math.floor((new Date() - new Date(props.startTime))/1000));
        console.log(dhms);
        this.state = {
            "name": props.name,
            "days": dhms[0],
            "hours": dhms[1],
            "mins": dhms[2],
            "secs": dhms[3]
        };
    }

    restartTime() {
        
    }
    componentDidMount() {
        this.timerCycle();
    }

    timerCycle() {
        console.log(this.state)
        let newState = this.state;
        let days = parseInt(newState.days);
        let hr = parseInt(newState.hours);
        let mins = parseInt(newState.mins);
        let secs = parseInt(newState.secs);
        
        secs += 1;
        if (secs == 60) {
            mins += 1;
            secs = 0;
          }
          if (mins == 60) {
            hr += 1;
            mins = 0;
            secs = 0;
          }
          if (hr == 24) {
            days += 1;
            hr = 0;
            mins = 0;
            secs = 0;
          }
          if ( days < 10) {
              days = '0' + days;
          }
          if (secs < 10 || secs == 0) {
            secs = '0' + secs;
          }
          if (mins < 10) {
            mins = '0' + mins;
          }
          if (hr < 10) {
            hr = '0' + hr;
          }
        newState.days = days;
        newState.hours = hr;
        newState.mins = mins;
        newState.secs = secs;

        this.setState(newState);
        setTimeout(this.timerCycle.bind(this),1000)
    }

    render() {
        return (
        <li className="timer" key={this.props.key}>
            <div className="name">{this.state.name}</div>
            <div className="time">{this.state.days}:{this.state.hours}:{this.state.mins}:{this.state.secs}</div>
        </li>
        );
    }
}


class Timers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "timers": []
        }
        
    }
    restartTime(key) {
        this.state.timers[key-1].startTime = new Date();
        
        window.location.reload(true);
    }
    
    componentDidMount() {
        fetch("/timers.json").then(response=> {
            response.json().then(json=>{
                this.setState({"timers": json["timers"]})
            });
        }) }

    render() { return(
        <div className="timers"><ul>{this.state.timers.map(timer => {
            return (
            <li key={timer.key}><Timer name={timer.name} startTime={timer.startTime} />
            <button className="restartButton" onClick={this.restartTime(timer.key)}></button>
            </li>)
        })}</ul></div>
    )}
}
ReactDOM.render(
    <Timers />,
    document.getElementById('root')
)