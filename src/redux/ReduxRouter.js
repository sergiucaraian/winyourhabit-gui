import React from 'react';
import { Router, Reducer } from 'react-native-router-flux';
import { connect } from 'react-redux';

class ReduxRouter extends React.Component {
  reducerCreate (params) {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  render () {
    return (
      <Router createReducer={this.reducerCreate.bind(this)} {...this.props} >
        {this.props.children}
      </Router>
    );
  }
}

export default connect()(ReduxRouter);
