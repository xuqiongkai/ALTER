// import React, { Component } from 'react';
// import { Redirect, Route } from "react-router-dom";
// import { makeSelectUser } from '../containers/App/selectors';
// import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
// import { compose } from 'redux';

// export const PrivateRoute = ({ component: Component, user, ...rest }) => (<Route
//         {...rest}
//         render={props =>
//             user ? (
//                 <component {...props} />
//             ) : (
//                     <Redirect
//                         to={{ pathname: "/signin" }}
//                     ></Redirect>
//                 )
//         }
//     />)

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props => (
        user
        ? <Component {...props} />
        : <Redirect to="/signin" />
    )}
  />
);

// export default PrivateRoute;