/**
 *
 * AnnotatePage
 *
 */

import React, { memo } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAnnotatePage, {
    makeSelectAddHistoryOk,
    makeSelectHint,
    makeSelectHintLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getWeightColor } from 'utils/colors';

import TextGrid from 'components/TextGrid';
import EditableDiv from 'components/EditableDiv';
import HistoryPanel from 'components/HistoryPanel';
import {
    addTextChange,
    changeSentence,
    revertChange,
    loadSentence,
    nextSentence,
    switchMode,
    clearChange,
} from '../App/actions';
import {
    makeSelectCurrentChanges,
    makeSelectSentences,
    makeSelectCurrentSentence,
    makeSelectTask,
    makeSelectCurrentSentenceIdx,
    makeSelectPreviousSentenceAvailable,
    makeSelectNextSentenceAvailable,
    makeSelectSentenceMetrics,
    makeSelectSentenceLoading,
    makeSelectAnnotationStatus,
    makeSelectSentencesLoading,
    makeSelectMode,
} from '../App/selectors';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HistoryIcon from '@material-ui/icons/History';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import clsx from 'clsx';
import { loadSentenceScore } from '../App/actions';
import {
    addHistory,
    invalidateHistory,
    loadHint,
    loadSentenceMetrics,
    resetHistory,
} from './actions';
import { Button, Switch } from '@material-ui/core';
import LoadingIndicator from 'components/LoadingIndicator';
import { FormControlLabel } from '@material-ui/core';
import { push } from 'connected-react-router';

const drawerWidth = 370;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    button: {
        margin: theme.spacing(1),
    },
    headBox: {
        display: 'flex',
        width: '100%',
        // height: '100%',
        overflow: 'visible',
        flexDirection: 'row',
        alignItems: 'center',
        margin: theme.spacing(1),
        marginBottom: '10px',
        alignItems: 'flex-end',
    },
    headIcon: {
        width: '50px',
        height: '50px',
    },
    attrBox: {
        marginLeft: 'auto',
        marginRight: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
    },
    attrScore: {
        color: '#222',
        background: '#EEE',
        border: '2px solid black',
        borderRadius: '5px',
        padding: theme.spacing(1),
        marginTop: '8px',
        marginBottom: '3px',
        margin: '3px',
        // margin: theme.spacing(0.5)
    },
    headLabel: {
        marginLeft: '10px',
        fontSize: '30px',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    drawerItemActive: {
        backgroundColor: '#5EAFF2',
        border: '1px solid white',
        borderRadius: '2px',
        '&:hover': {
            backgroundColor: '#5EAFF2',
        }
    },
    drawerItemInactive: {
        backgroundColor: 'white',
        border: '1px solid white',
        borderRadius: '2px',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    close: {
        padding: theme.spacing(0.5),
    },
    statusBarOk: {
        margin: '10px 0px 7px 0px',
        width: '90%',
        opacity: 0.5,
        background: '#5EAFF2',
        textAlign: 'center',
        borderRadius: '10px',
        fontSize: '24px',
        color: 'black',
    },
    statusBarNot: {
        margin: '10px 0px 7px 0px',
        width: '90%',
        opacity: 0.6,
        // background: '#f25050',
        background: theme.palette.secondary.main,
        textAlign: 'center',
        borderRadius: '10px',
        fontSize: '24px',
        color: 'black',
    },
}));

function metricBox(props, classes) {
    if (!props.auxiliary) {
        return (
            <div className={classes.headBox}>
                <BorderColorIcon className={classes.headIcon} />
                <Typography variant="h3" className={classes.headLabel}>
                    Annotating
                </Typography>
                <div className={classes.attrBox}>
                    <FormControlLabel
                        color="primary"
                        control={
                            <Switch
                                color="primary"
                                checked={props.auxiliary}
                                onChange={e => props.onSwitchMode()}
                                value="auxiliary"
                                label="auxiliary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        }
                        label="auxiliary"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={classes.headBox}>
            <BorderColorIcon className={classes.headIcon} />
            <Typography variant="h4" className={classes.headLabel}>
                Annotating
                {/* Privacy-aware Text Rewriting (demo) */}
            </Typography>
            <div className={classes.attrBox}>
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            checked={props.auxiliary}
                            onChange={e => props.onSwitchMode()}
                            value="auxiliary"
                            label="auxiliary"
                        />
                    }
                    label="auxiliary"
                />
                PPL:
                <Typography variant="h2" className={classes.attrScore}>
                    {props.metrics.lm && props.metrics.lm.toFixed(2)}
                </Typography>
                WMD:
                <Typography variant="h2" className={classes.attrScore}>
                    {props.metrics.wmd && props.metrics.wmd.toFixed(2)}
                </Typography>
                {/* getWeightColor expects value to be (-inf, +inf), whereas score is within (0, 1) */}
                ED:
                <Typography variant="h2" className={classes.attrScore}>
                    {props.metrics.ed && props.metrics.ed.toFixed(0)}
                </Typography>
                Class:
                <Typography
                    variant="h2"
                    className={classes.attrScore}
                    style={{ background: getWeightColor((-1 * (1 - props.metrics.class)) / 2) }}
                >
                    {props.metrics.class && (1 - props.metrics.class).toFixed(2)}
                </Typography>
                <Typography
                    variant="h2"
                    className={classes.attrScore}
                    style={{ background: getWeightColor(props.metrics.class / 2) }}
                >
                    {props.metrics.class && props.metrics.class.toFixed(2)}
                </Typography>
            </div>
        </div>
    );
}

function sentenceList(props, classes, handleDrawerClose) {
    return (
        <List>
            {props.sentences.map((words, index) => {
                let sent = words
                    .map(w => w.token)
                    .join(' ')
                    .slice(0, 100);
                return (
                    <ListItem
                        button
                        key={index}
                        // style={{
                        //     backgroundColor: props.annotationStatus[index] ? '#5EAFF2' : 'white',
                        //     border: '1px solid white',
                        //     borderRadius: '2px',
                        // }}
                        className={props.annotationStatus[index] ? classes.drawerItemActive : classes.drawerItemInactive}
                        onClick={e => {
                            props.onChangeSentence(index);
                            handleDrawerClose();
                        }}
                    >
                        <ListItemText primary={sent} />
                    </ListItem>
                );
            })}
        </List>
    );
}

export function AnnotatePage(props) {
    useInjectReducer({ key: 'annotatePage', reducer });
    useInjectSaga({ key: 'annotatePage', saga });

    const classes = useStyles();
    const theme = useTheme();

    var EditableH1 = EditableDiv('h1');
    var Editablediv = EditableDiv('div');

    let words = "Outlines never take up space, as they are drawn outside of an element's content";
    words = words.split(' ').map(w => ({
        token: w,
        weight: Math.random() * 2 - 1,
    }));

    const [open, setOpen] = React.useState(false);

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    function choosePrevious(e) {
        let idx = Math.max(0, props.currentSentenceIdx - 1);
        props.onChangeSentence(idx);
    }

    function chooseNext(e) {
        let idx = Math.min(props.sentences.length - 1, props.currentSentenceIdx + 1);
        props.onChangeSentence(idx);
    }

    const previousAvailble = props.sentences && props.currentSentenceIdx > 0;
    const nextAvailble = props.sentences && props.currentSentenceIdx < props.sentences.length;
    const origin =
        props.sentences &&
        props.currentSentenceIdx !== false &&
        props.currentSentenceIdx < props.sentences.length
            ? props.sentences[props.currentSentenceIdx].map(w => w.token).join(' ')
            : '';

    return (
        <div>
            <CssBaseline />
            {/* <SideNav>
                <SideNav.Toggle></SideNav.Toggle>
                <SideNav.Nav defaultSelected="home">
                    <NavItem eventKey="home">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav> */}

            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, open && classes.hide)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    Show all sentences
                </Typography>

                <div style={{ marginLeft: 'auto' }}>
                    <Button
                        className={classes.button}
                        color="secondary"
                        variant="outlined"
                        onClick={props.onReturnToTask}
                    >
                        Back to Task
                    </Button>
                </div>

                <div style={{ marginLeft: 'auto' }}>
                    <Button
                        className={classes.button}
                        color="primary"
                        variant="outlined"
                        disabled={!previousAvailble}
                        onClick={choosePrevious}
                    >
                        Previous
                    </Button>
                    <Button
                        className={classes.button}
                        color="primary"
                        variant="outlined"
                        disabled={!nextAvailble}
                        onClick={chooseNext}
                    >
                        Next
                    </Button>
                </div>
            </Toolbar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                {/* {props.senetencesLoading ? <LoadingIndicator /> : sentenceList(props, classes)} */}
                {sentenceList(props, classes, handleDrawerClose)}
            </Drawer>

            <Helmet>
                <title>Annotation Page</title>
                <meta name="description" content="annotate" />
            </Helmet>
            <div>{metricBox(props, classes)}</div>
            <div>
                <TextGrid
                    origin={origin}
                    onTextChange={change => {
                        props.onTextChange(change);
                    }}
                    onFetchHint={props.onFetchHint}
                    words={props.currentSentence}
                    hint={props.hint}
                    hintLoading={props.hintLoading}
                    auxiliary={props.auxiliary}
                />
            </div>
            {/* <div>
                {props.changes.map((change, idx) => {
                    return (
                        <div>
                            <div>{change.opt}</div>
                            <div>{change.sentence}</div>
                        </div>
                    );
                })}
            </div> */}
            <div style={{ marginTop: '30px' }} />
            <Divider />

            <div className={classes.headBox}>
                <HistoryIcon className={classes.headIcon} />
                <Typography variant="h3" className={classes.headLabel}>
                    Revision History
                </Typography>
            </div>
            <div>
                <HistoryPanel
                    words={props.currentSentence}
                    history={props.changes}
                    onRevertChange={props.onRevertChange}
                    onClearChange={props.onClearChange}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    primary="true"
                    onClick={(e) => props.onSubmit(props.changes)}
                    className={classes.button}
                >
                    Submit
                </Button>
                <Typography
                    variant="h1"
                    className={props.addHistoryOk ? classes.statusBarOk : classes.statusBarNot}
                >
                    {props.addHistoryOk ? 'Synced' : 'Not Synced'}
                </Typography>
            </div>
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    annotatePage: makeSelectAnnotatePage(),
    changes: makeSelectCurrentChanges(),
    sentences: makeSelectSentences(),
    senetencesLoading: makeSelectSentencesLoading(),
    annotationStatus: makeSelectAnnotationStatus(),
    currentSentence: makeSelectCurrentSentence(),
    currentSentenceIdx: makeSelectCurrentSentenceIdx(),
    // score: makeSelectCurrentScore(),
    // scoreLM: makeSelectSentenceScoreLM(),
    addHistoryOk: makeSelectAddHistoryOk(),
    hint: makeSelectHint(),
    hintLoading: makeSelectHintLoading(),
    metrics: makeSelectSentenceMetrics(),
    sentenceLoading: makeSelectSentenceLoading(),
    auxiliary: makeSelectMode(),
});

function mapDispatchToProps(dispatch) {
    // console.log('map dispatch')
    // console.log(ownProps)
    return {
        onTextChange: change => {
            dispatch(addTextChange(change));
            dispatch(invalidateHistory());
            dispatch(loadSentenceMetrics(change.sentence));
            // dispatch(loadSentenceScore(change.sentence));
            // dispatch(loadSentenceScoreLM(change.sentence));
        },
        onChangeSentence: idx => {
            dispatch(changeSentence(idx));
            dispatch(resetHistory());
            dispatch(loadSentence(idx));
            // if (ownProps.sentences && ownProps.sentencces[idx]) {
            //     dispatch(loadSentenceMetrics(ownProps.sentences[idx]));
            // }
        },
        onRevertChange: (idx, change) => {
            dispatch(revertChange(idx));
            dispatch(invalidateHistory());
            dispatch(loadSentenceMetrics(change.sentence));
            // dispatch(loadSentenceMetrics());
            // dispatch(loadSentenceScore(change.sentence));
        },
        onClearChange: () => {
            dispatch(clearChange());
            dispatch(invalidateHistory());
        },
        onSubmit: (changes) => {
            // const task = makeSelectTask();
            // const sentIdx = makeSelectCurrentSentenceIdx();
            // const changes = makeSelectCurrentChanges();
            dispatch(addHistory(changes));
        },
        onFetchHint: (sentence, idx, model) => {
            dispatch(loadHint(sentence, idx, model));
        },
        onSwitchMode: () => {
            dispatch(switchMode());
        },
        onReturnToTask: () => {
            dispatch(push('/'));
        },
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(AnnotatePage);
