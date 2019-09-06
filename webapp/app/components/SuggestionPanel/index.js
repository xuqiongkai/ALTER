import React, { Component } from 'react';
import './index.css';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import LoadingIndicator from 'components/LoadingIndicator';
import { Typography } from '@material-ui/core';
import isEqual from 'lodash/isEqual';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        height: '200px',
        overflow: 'auto',
        transition: '1s',
    },
    empty: {
        width: '100%',
        backgroundColor: 'gray',
        height: '200px',
        overflow: 'auto',
        border: '1px solid white',
        transition: '1s',
    },
    title: {
        marginTop: theme.spacing(1)
    }
}));

function SuggestionList(props) {
    const classes = useStyles();
    const onClick = props.onClick;
    return (
        <div className={classes.root}>
            <List component="nav" aria-label="Secondary mailbox folders">
                {props.items.map(function(item, idx) {
                    return (
                        <ListItem
                            key={idx}
                            button
                            onClick={e => {
                                onClick(props.items[idx]);
                            }}
                        >
                            <ListItemText data-category={item} key={item}>
                                {item}
                            </ListItemText>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}

function EmptyList(props) {
    const classes = useStyles();

    return <div className={classes.empty} />;
}

class SuggestionPanel extends Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     initialItems: [
        //         'Apples',
        //         'Broccoli',
        //         'Chicken',
        //         'Duck',
        //         'Eggs',
        //         'Fish',
        //         'Granola',
        //         'Hash Browns',
        //     ],
        //     items: [],
        // };

        // console.log('suggestion panel');
        // console.log(props);

        this.state = {
            initialItems: props.hint || [],
            items: [],
        };

        this.onClick = props.onClick;
    }

    filterList = event => {
        var updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function(item) {
            return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        this.setState({ items: updatedList });
    };

    getInitialState() {
        return;
    }

    componentWillMount() {
        this.setState({ items: this.state.initialItems });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!isEqual(prevProps.hint, this.props.hint)) {
            this.setState({
                initialItems: this.props.hint || [],
                items: this.props.hint || [],
            });
        }
    }

    render() {
        // console.log('available' + this.props.available);
        return (
            <div className="suggest-panel" style={{ marginRight: '8px' }}>
                <form onSubmit={e => e.preventDefault()}>
                    <fieldset className="form-group">
                        {/* <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList} /> */}
                        {/* <Input placeholder="Search..." onChange={this.filterList} style={{width: "50%"}} /> */}
                        <Typography variant="h3" style={{marginBottom: "8px"}}>Recommendations:</Typography>
                        {/* <TextField
                            placeholder="Search Recommendations..."
                            onChange={this.filterList}
                            style={{ width: '50%', visibility: 'collapse' }}
                        /> */}
                    </fieldset>
                </form>
                {this.props.loading ? (
                    <LoadingIndicator />
                ) : this.props.available ? (
                    <SuggestionList items={this.state.items} onClick={this.props.onClick} />
                ) : (
                    <Fade>
                        <EmptyList />
                    </Fade>
                )}
            </div>
        );
    }
}

export default SuggestionPanel;
