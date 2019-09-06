/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import AnnotatePage from 'containers/AnnotatePage';
import SignupPage from 'containers/SignupPage';

import GlobalStyle from '../../global-styles';
import DatasetPage from 'containers/DatasetPage';
import SigninPage from 'containers/SigninPage';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/styles';
// import { PlaygroundPage } from '../PlaygroundPage';
import TaskPage from '../TaskPage';
import { PrivateRoute } from 'utils/privateRoute.js';
import { connect } from 'react-redux';
import { makeSelectUser, makeSelectMessageBar } from './selectors';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import MessageBar from 'components/MessageBar';
import Snackbar from '@material-ui/core/Snackbar';
import { closeMessageBar } from './actions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppWrapper = styled.div`
    max-width: calc(1080px + 16px * 2);
    margin: 0 auto;
    display: flex;
    min-height: 100%;
    padding: 0 16px;
    flex-direction: column;
`;

// export default function App(props) {
function App(props) {
  const classes = useStyles();
  // console.log(props.user)

  return (
    <div>
      {/* <AppBar className={classes.root} position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="Menu"
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" 
                className={classes.title}
                >
                    News
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
 */}

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={props.messageBar.open}
        autoHideDuration={6000}
        onClose={props.onCloseMessageBar}
      >
        <MessageBar
          variant={props.messageBar.variant}
          // className={classes.margin}
          onClose={props.onCloseMessageBar}
          message={props.messageBar.message}
        />


      </Snackbar>
      <AppWrapper>
        {/* <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <Header /> */}
        <Switch>
          {/* <Route exact path="/" component={TaskPage} />
                <Route path="/features" component={FeaturePage} />
                <Route path="/annotate" component={AnnotatePage} />
                <Route path="/dataset" component={DatasetPage} />
                <Route path="/test" component={PlaygroundPage} />
                <Route path="/signin" component={SigninPage} />
                <Route path="" component={NotFoundPage} />
                */}
          <Route exact path="/" component={TaskPage} user={props.user} />
          <Route path="/features" component={FeaturePage} />
          <Route path="/annotate" component={AnnotatePage} user={props.user} />
          <Route path="/dataset" component={DatasetPage} />
          {/* <Route path="/test" component={PlaygroundPage} /> */}
          <Route path="/signin" component={SigninPage} />
          {/* <PrivateRoute path="/signup" component={SignupPage} user={props.user.user_type == 'admin' ? props.user : null} /> */}
          <Route path="/signup" component={SignupPage} />
          <Route path="" component={NotFoundPage} />
        </Switch>
        <Footer />
        <GlobalStyle />
      </AppWrapper>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  messageBar: makeSelectMessageBar(),
})

function mapDispatchToProps(dispatch) {
  return {
    onCloseMessageBar: () => dispatch(closeMessageBar())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(App);
