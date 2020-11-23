import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const response = await axios.get('/api/values/current');
      if(response.data.error)
        alert("Something went wrong, please try again later!");
      else
        this.setState({ values: response.data.data });
    } catch (error) {
      alert("Something went wrong, please try again later!"); 
    }
  }

  async fetchIndexes() {
    try {
      const response = await axios.get('/api/values/all');
      if(response.data.error)
        alert("Something went wrong, please try again later!");
      else
        this.setState({ seenIndexes: response.data.data });
    } catch (error) {
      alert("Something went wrong, please try again later!");
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/values', { index: this.state.index });
      if(response.data.error)
        alert("Something went wrong, please try again later!");
      else
        this.setState({ index: '' });
    } catch (error) {
      alert("Something went wrong, please try again later!");
    }
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ numberindex }) => numberindex).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
