import React, { Component } from 'react';
import { getGradientColor } from '../../utils/colors';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import HelpIcon from '@material-ui/icons/Help';
import FaceIcon from '@material-ui/icons/Face';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

// Ref: https://www.kirupa.com/react/styling_in_react.htm

function Word(props) {
    var letterStyle = {
        padding: 10,
        margin: 10,
        backgroundColor: props.bgcolor,
        color: '#333',
        display: 'inline-block',
        fontFamily: 'monospace',
        fontSize: 16,
        textAlign: 'center',
    };

    return <div style={letterStyle}>{props.children}</div>;
}

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        margin: '5px',
        marginLeft: '8px',
        // marginLeft: '2px',
        // marginRight: '2px',
        justifyContent: 'center',
        background: '#e0f7fa',
        // background: "#a2d0f6",
    },
    details: {
        // display: 'flex',
        // flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        // paddingLeft: theme.spacing(1),
        // paddingBottom: theme.spacing(1),
        justifyContent: 'space-between',
        width: '100%',
        border: '1px solid #5EAFF2',
        borderRadius: '10px',
    },
    content: {
        marginLeft: '5px',
        flex: '1 0 auto',
        width: '80%',
    },
    cover: {
        width: 151,
    },
    controls: {
        // display: 'flex',
        // justifyContent: 'flex-end',
        // alignItems: 'center',
        // paddingLeft: theme.spacing(1),
        // paddingBottom: theme.spacing(1),
        marginLeft: 'auto',
        order: 2,
        color: 'red',
    },
    playIcon: {
        margin: '5px',
        borderRadius: '50%',
        border: '2px solid',
        background: 'yellow',
    },
    iconBox: {
        margin: '0px',
        borderRadius: '15px',
        marginRight: '15px',
    },
    edit: {
        // borderColor: '#2196f3',
        // borderRadius: 7,
        // border: '3px solid white'
        background: '#2196f3',
    },
    exchange: {
        // borderColor: '#ff5722',
        // borderRadius: 7,
        // border: '3px solid white'
        background: '#ff5722',
    },
    recommendation: {
        // borderColor: '#d81b60',
        // borderRadius: 7,
        // border: '3px solid white'
        background: '#d81b60',
    },
    delete: {
        background: '#ff1744',
        // borderRadius: 7,
        // border: '3px solid white'
    },
    manual: {
        // borderColor: '#ff1744',
        background: '#ff1744',
        // borderRadius: 7,
        // border: '3px solid white'
    },
    title: {
        margin: '10px',
    },
}));

function optIcon(opt) {
    switch (opt) {
        case 'exchange':
            return <AutorenewIcon />;
        case 'edit':
            return <EditIcon />;
        case 'recommendation':
            return <SearchIcon />;
        case 'delete':
            return <DeleteIcon />;
        case 'manual':
            return <KeyboardIcon />;
        case 'clear':
            return <ThreeSixtyIcon />;
    }
}

function historyRecord(key, change, onRevertChange, theme, classes) {
    return (
        <Card key={key} className={classes.card}>
            {/* <div className={clsx(classes.details, classes[change.opt])}> */}
            <div className={classes.details}>
                {/* <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                    Live From Space
          </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Mac Miller
          </Typography>
            </CardContent> */}
                <div className={clsx(classes.iconBox, classes[change.opt])}>
                    <div className={classes.playIcon}>
                        <Tooltip title={change.opt} placement="top">
                            {optIcon(change.opt)}
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.content}>{change.sentence}</div>
                <div className={classes.controls}>
                    <IconButton
                        aria-label="Revert"
                        onClick={e => {
                            onRevertChange(key, change);
                        }}
                    >
                        <ThreeSixtyIcon />
                    </IconButton>
                    {/* <IconButton aria-label="Reset">
                    {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                </IconButton>
                <IconButton aria-label="Play/pause">
                    <PlayArrowIcon className={classes.playIcon} />
                </IconButton>
                <IconButton aria-label="Next">
                    {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                </IconButton> */}
                </div>
            </div>
            {/* <CardMedia
        className={classes.cover}
        image="/static/images/cards/live-from-space.jpg"
        title="Live from space album cover"
      /> */}
        </Card>
    );
}

function resetRecord(key, onClearChange, theme, classes) {
    return (
        <Card key={key} className={classes.card}>
            <div className={classes.details}>
                {/* <div className={clsx(classes.iconBox, classes['clear'])}>
            <div className={classes.playIcon}>
                <Tooltip title={'clear'} placement="top">
                    {optIcon('clear')}
                </Tooltip>
            </div>
            </div> */}
                <div className={classes.content} style={{ textAlign: 'center' }}>
                    RESET
                </div>
                {/* <div className={classes.controls}> */}
                <div className={classes.playIcon} style={{}}>
                    <IconButton
                        aria-label="Revert"
                        onClick={e => {
                            onClearChange();
                        }}
                        style={{ padding: '2px' }}
                    >
                        <ThreeSixtyIcon />
                    </IconButton>
                </div>
            </div>
        </Card>
    );
}

function HistoryPanel(props) {
    const classes = useStyles();
    const theme = useTheme();
    const countChanges = props.history.length;

    return (
        <div>
            {/* <Typography variant="h3" color="textPrimary" className={classes.title}>
                History
            </Typography> */}
            {/* {this.props.words && this.props.words.map((w, idx) => (
                    <Word key={idx} bgcolor={getGradientColor('#0000ff', '#ff3300', w.weight)}>
                        {w.token}
                    </Word>))} */}
            {props.history &&
                props.history
                    .slice(0)
                    .reverse()
                    .map((change, idx) =>
                        historyRecord(
                            countChanges - 1 - idx,
                            change,
                            props.onRevertChange,
                            theme,
                            classes,
                        ),
                    )}
            {resetRecord(-1, props.onClearChange, theme, classes)}
        </div>
    );
}

export default HistoryPanel;
