/**
 *
 * SignupPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import reducer from './reducer';
import saga from './saga';
import messages from './messages';
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

import clsx from 'clsx';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Paper from '@material-ui/core/Paper';
import background from 'images/background.png';
import makeSelectSignupPage from './selectors';
import MessageBar from 'components/MessageBar';
import { showMessageBar } from '../App/actions';
import { loadSignup } from './actions';


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

// export function SignupPage() {
class SignupPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            name: '',
            openError: false
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

    onSubmit = (e) => {
        e.preventDefault();
        if (!this.state.username || !this.state.password || !this.state.name) {
            this.setState({
                openError: true
            })
            return;
        }

        this.props.onSignup(this.state.username, this.state.password, this.state.name)
    }

    render() {

        // const classes = useStyles();
        const { classes } = this.props;
        const { openError } = this.state;

        return (
            // <Container component="main" maxWidth="xs">
            <div>

                <Grid container component="div" className={classes.root}>

                    <CssBaseline />
                    <Grid item xs={false} sm={4} md={7} className={classes.image} />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Helmet>
                            <title>Signup Page</title>
                            <meta name="description" content="Description of SigninPage" />
                        </Helmet>
                        <CssBaseline />

                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign Up
                        </Typography>
                            <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                                <TextField
                                    required
                                    error={openError}
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
                                    error={openError}
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
                                <TextField
                                    error={openError}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="name"
                                    label="name"
                                    id="name"
                                    autoComplete="name"
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
                                    Create a User
                        </Button>
                            </form>
                        </div>
                        <Box mt={5}>
                            <MadeWithLove />
                        </Box>
                        {/* </Container> */}

                    </Grid>
                </Grid>
            </div>
        );

    }
}

const mapStateToProps = createStructuredSelector({
    signupPage: makeSelectSignupPage(),
});

function mapDispatchToProps(dispatch) {
    return {
        onSignup: (username, password, name) => dispatch(loadSignup(username, password, name))
    };
}

const withReducer = injectReducer({ key: 'signupPage', reducer });
const withSaga = injectSaga({ key: 'signupPage', saga });

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withReducer,
    withSaga,
    withStyles(styles),
    withConnect,
    memo,
)(SignupPage);
