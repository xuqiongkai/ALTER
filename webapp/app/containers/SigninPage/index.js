/**
 *
 * SigninPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectSigninPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { signin } from '../App/actions';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/styles';
import { push } from 'connected-react-router';
import { makeSelectSigninStatus } from '../App/selectors';

import clsx from 'clsx';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Paper from '@material-ui/core/Paper';
import background from 'images/background.png';

function MadeWithLove() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Built with love'}
            {/* <Link color="inherit" href="https://material-ui.com/">
                Material-UI
            </Link>
            {' team.'} */}
        </Typography>
    );
}

const styles = theme => ({
    // '@global': {
    //     body: {
    //         backgroundColor: theme.palette.common.white,
    //     },
    // },
    // paper: {
    //     marginTop: theme.spacing(8),
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    // },
    // avatar: {
    //     margin: theme.spacing(1),
    //     backgroundColor: theme.palette.secondary.main,
    // },
    // form: {
    //     width: '100%', // Fix IE 11 issue.
    //     marginTop: theme.spacing(1),
    // },
    // submit: {
    //     margin: theme.spacing(3, 0, 2),
    // },
    root: {
        // height: '100vh',
        height: '600px',
    },
    image: {
        // backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundImage: 'url(' + background + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

    error: {
        backgroundColor: theme.palette.error.dark,
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
})


class SigninPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            openError: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // if the current signin status is failure
        // and the error bar is closed
        // we make it open again
        if (prevProps.signinStatus && !this.props.signinStatus) {
            // if (!this.props.signinStatus && !this.state.openError) {
            this.setState({
                openError: true
            })
        }
    }


    handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    handleOpenError = () => {
        this.setState({ openError: true })
    }

    handleOpenErrorClose = (event, reason) => {
        if (reason == 'clickaway') {
            return;
        }

        this.setState({ openError: false })
    }

    render() {

        // const classes = useStyles();
        const { classes } = this.props;
        const { signinStatus } = this.props;

        return (
            // <Container component="main" maxWidth="xs">
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Helmet>
                        <title>SigninPage</title>
                        <meta name="description" content="Description of SigninPage" />
                    </Helmet>
                    <CssBaseline />

                    <div>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={this.state.openError}
                            autoHideDuration={6000}
                            onClose={this.handleOpenErrorClose}>

                            <SnackbarContent className={clsx(classes.error, classes.margin)}
                                aria-describedby="client-snackbar"
                                message={
                                    <span id="client-snackbar" className={classes.message}>
                                        <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
                                        Failed to sign-in.
                            </span>
                                }
                                action={[
                                    <IconButton key="close" aria-label="Close" color="inherit"
                                        onClick={this.handleOpenErrorClose}>
                                        <CloseIcon className={classes.icon} />
                                    </IconButton>
                                ]}
                            />
                        </Snackbar>
                    </div>

                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                </Typography>
                        <form className={classes.form} noValidate onSubmit={(e) => {
                            e.preventDefault();
                            this.props.onSignin(this.state.username, this.state.password)
                        }}>
                            <TextField
                                required
                                error={!signinStatus}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                onChange={this.handleInputChange}
                            />
                            <TextField
                                error={!signinStatus}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={this.handleInputChange}
                            />
                            {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                        </Button>
                            <Grid container>
                                {/* <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                            </Link>
                            </Grid> */}
                                {/* <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid> */}
                            </Grid>
                        </form>
                    </div>
                    <Box mt={5}>
                        <MadeWithLove />
                    </Box>
                    {/* </Container> */}
                </Grid>
            </Grid>
        );

    }
}


const mapStateToProps = createStructuredSelector({
    signinPage: makeSelectSigninPage(),
    signinStatus: makeSelectSigninStatus(),
});

function mapDispatchToProps(dispatch) {
    return {
        onSignin: (username, password) => {
            dispatch(signin(username, password));
        }
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'signinPage', reducer });
const withSaga = injectSaga({ key: 'signinPage', saga });

export default compose(
    withReducer,
    withSaga,
    withStyles(styles),
    withConnect,
    memo,
)(SigninPage);
