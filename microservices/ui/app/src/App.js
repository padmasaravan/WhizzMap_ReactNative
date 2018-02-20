import React, { Component } from 'react';
import MyMap from "./components/Map";
import Navbar from './components/Navbar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <MyMap />
      </div>
    );
  }
}

export default App;
