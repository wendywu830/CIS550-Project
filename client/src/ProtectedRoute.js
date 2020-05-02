
import React from "react";
import { Route, Redirect } from "react-router-dom";

export default class ProtectedRoute extends React.Component {

  render() {
    const { component: Component, ...props } = this.props
    const isLoggedIn = localStorage && localStorage.getItem('email') !== null
    return (
      <Route 
        {...props} 
        render={props => (
          isLoggedIn ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )} 
      />
    )
  }
}