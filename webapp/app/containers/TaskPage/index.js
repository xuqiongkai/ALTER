/**
 *
 * TaskPage
 *
 */

import React, { memo } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTaskPage, { makeSelectAllAssignees } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectTasks } from './selectors';
import {
    loadTasks,
    addTask,
    loadAssignees,
    updateTaskAssignees,
    removeUserFromTask,
    submitAssignees,
} from './actions';
import { loadTask } from '../App/actions';

import { lighten, withStyles } from '@material-ui/core/styles';
import { Typography, Chip } from '@material-ui/core';
import { Card } from '@material-ui/core';
import { LinearProgress } from '@material-ui/core';
import { Button } from '@material-ui/core';
import TaskUpload from '../../components/TaskUpload';
import { makeSelectUser } from '../App/selectors';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import isEqual from 'lodash/isEqual';

const s = lighten('#ff6c5c', 0.5);
const styles = theme => ({
    header: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    headerNavigate: {
        marginLeft: 'auto',
    },
    headerText: {
        marginBottom: '10px',
    },
    button: {
        margin: theme.spacing(1),
    },
    icon: {
        margin: '5px',
        width: '96px',
        height: '96px',
    },
    top: {
        color: '#eef3fd',
    },
    bottom: {
        color: '#6798e5',
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
    margin: {
        margin: theme.spacing(1),
    },
    card: {
        display: 'flex',
        margin: theme.spacing(1.5),
        // marginLeft: '2px',
        // marginRight: '2px',
        justifyContent: 'center',
        background: '#e0f7fa',
        border: '2px solid gray',
    },
    title: {
        width: '100%',
        // marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
        display: 'flex',
        // width: '30%',
    },
    titleText: {
        marginRight: 'auto',
        fontFamily: 'monospace',
        fontSize: 28,
        textAlign: 'center',
    },
    details: {
        // display: 'flex',
        // flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        // paddingBottom: theme.spacing(1),
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'column',
    },
    content: {
        marginLeft: theme.spacing(2),
        marginRight: 'auto',
        flex: '1 0 auto',
        width: '90%',
    },
    progress: {
        height: 10,
        backgroundColor: s,
        borderRadius: 20,
        backgroundColor: '#ff6c5c',
        marginRight: 'auto',
        marginBottom: theme.spacing(1),
    },
    cover: {
        width: 151,
    },
    controls: {
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
    empty: {
        width: '100%',
        textAlign: 'center',
        background: '#80aafb',
    },
    userChipPanel: {
        display: 'flex',
        // justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
        width: '100%',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    userChip: {
        margin: theme.spacing(0.5),
    },
    assignFormPanel: {
        display: 'flex',
        padding: theme.spacing(0.5),
        width: '100%',
    },
    assignForm: {
        // dispaly: 'flex',
        // flexWrap: 'wrap',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: '50%',
        minWidth: 300,
        maxWidth: 600,
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            color: '#80aafb',
        },
    },
};

function doNothing(e) {}

function craeteTask(
    key,
    user_type,
    task,
    assignees,
    classes,
    onClick,
    onAssign,
    onDismiss,
    onSubmitAssign,
) {
    return (
        <Card key={key} className={classes.card}>
            <div className={classes.details}>
                <div className={classes.title}>
                    <Button className={classes.titleText} onClick={onClick}>
                        {task.name}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={e => onSubmitAssign(key)}
                        disabled={user_type != 'admin'}
                    >
                        Update
                    </Button>
                    {/* // <Typography className={classes.titleText}>{task.name}</Typography> */}
                </div>

                {user_type == 'admin' && (
                    <div className={classes.userChipPanel}>
                        {task.assignees.map(u => (
                            <Chip
                                key={u.id}
                                label={u.name}
                                className={classes.userChip}
                                color="secondary"
                                onDelete={e => onDismiss(key, u.id)}
                                // deleteIcon={<DoneIcon></DoneIcon>}
                            />
                        ))}
                    </div>
                )}

                {user_type == 'admin' && (
                    <div className={classes.assignFormPanel}>
                        <FormControl className={classes.assignForm}>
                            <InputLabel htmlFor={`select-multiple-checkbox-${key}`}>
                                Assignees
                            </InputLabel>
                            <Select
                                multiple
                                value={task.assignees} // .map(w => w.id)}
                                onChange={e => onAssign(key, e.target.value)}
                                // onChange={(e, idx, values) => console.log(key, e, e.target.value, idx, values)}
                                input={<Input id={`select-multiple-assignees-${key}`} />}
                                renderValue={selected => selected.map(w => w.name).join(' ')}
                                // renderValue={selected => " "}
                                MenuProps={MenuProps}
                                variant="filled"
                            >
                                {assignees &&
                                    assignees.map(u => (
                                        <MenuItem key={u.id} value={u}>
                                            <Checkbox
                                                color="primary"
                                                checked={
                                                    !!task.assignees.find(
                                                        assign => assign.id === u.id,
                                                    )
                                                }
                                            />
                                            <ListItemText primary={u.name} />
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                )}

                <div className={classes.content}>
                    <LinearProgress
                        className={classes.progress}
                        variant="determinate"
                        color="primary"
                        value={100}
                    />
                </div>
            </div>
        </Card>
    );
}

class TaskPage extends React.Component {
    componentDidMount() {
        // console.log('loading tasks');
        const user_type = this.props.user ? this.props.user.user_type : 'user';
        this.props.onLoading(user_type);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('did update', prevProps.user, this.props.user);
        if (!isEqual(prevProps.user, this.props.user)) {
            const user_type = this.props.user ? this.props.user.user_type : 'user';
            // console.log(user_type);
            this.props.onLoading(user_type);
        }
    }

    render() {
        const { classes } = this.props;
        const user_type = this.props.user ? this.props.user.user_type : 'user';
        // const user_type = 'admin';
        // console.log('rendering with ', this.props.user);

        return (
            <div>
                <Helmet>
                    <title>TaskPage</title>
                    <meta name="description" content="Description of TaskPage" />
                </Helmet>
                <div>
                    <div className={classes.header}>
                        <AssignmentIcon className={classes.icon} />
                        <Typography variant="h1" color="textPrimary" className={classes.headerText}>
                            Tasks
                        </Typography>
                        <div className={classes.headerNavigate}>
                            <Button
                                className={classes.button}
                                color="primary"
                                variant="outlined"
                                onClick={this.props.onGoSignin}
                            >
                                Switch User
                            </Button>

                            {user_type == 'admin' && (
                                <Button
                                    className={classes.button}
                                    color="primary"
                                    variant="outlined"
                                    onClick={this.props.onGoSignup}
                                >
                                    Register Annotators
                                </Button>
                            )}
                        </div>
                    </div>
                    <div style={{ margin: '10px' }} />
                    {this.props.tasks ? (
                        this.props.tasks.map((task, idx) => {
                            return craeteTask(
                                idx,
                                user_type,
                                task,
                                this.props.assignees,
                                classes,
                                this.props.user.user_type == 'admin'
                                    ? doNothing
                                    : e => this.props.onChooseTask(task),
                                this.props.onAssign,
                                this.props.onDismiss,
                                this.props.onSubmitAssign,
                            );
                        })
                    ) : (
                        <div className={classes.empty}>No task found</div>
                    )}
                </div>
                {this.props.user.user_type == 'admin' && (
                    <div style={{ margin: '20px' }}>
                        <TaskUpload onSubmit={this.props.onCreateTask} />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    taskPage: makeSelectTaskPage(),
    tasks: makeSelectTasks(),
    user: makeSelectUser(),
    assignees: makeSelectAllAssignees(),
});

function mapDispatchToProps(dispatch) {
    return {
        onLoading: user_type => {
            console.log('loading with', user_type);
            dispatch(loadTasks());
            if (user_type == 'admin') {
                dispatch(loadAssignees());
            }
        },
        onChooseTask: task => {
            dispatch(loadTask(task));
            dispatch(push('/annotate'));
        },
        onCreateTask: (name, file) => {
            // console.log('create');
            dispatch(addTask(name, file));
        },
        onAssign: (taskIdx, assignees) => dispatch(updateTaskAssignees(taskIdx, assignees)),
        onDismiss: (taskIdx, userId) => dispatch(removeUserFromTask(taskIdx, userId)),
        onSubmitAssign: taskIdx => dispatch(submitAssignees(taskIdx)),
        onGoSignin: () => dispatch(push('/signin')),
        onGoSignup: () => dispatch(push('/signup')),
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'taskPage', reducer });
const withSaga = injectSaga({ key: 'taskPage', saga });

export default compose(
    withReducer,
    withSaga,
    withStyles(styles),
    withConnect,
    memo,
)(TaskPage);
