import React, { Component } from 'react';
import MuuriGrid from 'react-muuri';
import './index.css';
import EditableDiv from 'components/EditableDiv';
import { Menu, Item, Separator, Submenu, MenuProvider, contextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import SuggestionPanel from '../SuggestionPanel';
import { Typography, Box, Badge } from '@material-ui/core';
import { getWeightColor } from 'utils/colors';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import isEqual from 'lodash/isEqual';

// const onClick = ({ event, props }) => console.log(event, props);

const MyAwesomeMenu = ({ deleteRow, showHintLM, showHintSemantic }) => (
    <Menu id="menu_id" style={{ zIndex: 1 }}>
        <Item onClick={showHintSemantic}>Hint: Word Similarity</Item>
        <Item onClick={showHintLM}>Hint: Language Model</Item>
        <Item onClick={deleteRow}>Delete</Item>
        {/* <Separator /> */}
    </Menu>
);

class TextGrid extends Component {
    constructor(props) {
        super(props);
        // console.log('constructing TextGrid with ', props);

        let words = props.words;
        if (words == null || words.length == 0) {
            words = "";
                // "Outlines never take up space , as they are drawn outside of an element's content";
            words = words.split(' ').map(w => ({
                token: w,
                weight: Math.random() * 2 - 1,
            }));
        }

        this.state = {
            words: words,
            selectedWordIdx: null,
            selectHintModel: null,
        };

        this.removeElement = this.removeElement.bind(this);
        this.onTextChange = props.onTextChange;
        this.selfInputRef = React.createRef();
    }

    createMuuri() {
        // console.log('creating murri')
        // console.log(this.gridElement);
        // console.log(this.state.words);

        // sort children
        let childrens = this.gridElement.children;
        let p = this.gridElement;
        Array.prototype.slice
            .call(p.children)
            .map(function(x) {
                return p.removeChild(x);
            })
            .sort(function(a, b) {
                return parseInt(a.getAttribute('data-id')) - parseInt(b.getAttribute('data-id'));
            })
            .forEach(function(x) {
                p.appendChild(x);
            });

        for (let i = 0; i < p.children.length; ++i) {
            p.children[i].style.width = this.getItemWidth(p.children[i].children[0].textContent);
        }

        this.grid = new MuuriGrid({
            node: this.gridElement,
            defaultOptions: {
                dragEnabled: true, // See Muuri's documentation for other option overrides.
                // dragStartPredicate: { distance: 0, delay: 0, handle: false },
                dragStartPredicate: function(item, e) {
                    // Start moving the item after the item has been dragged for one second.
                    if (e.deltaTime > 100) {
                        return true;
                    }
                },
            },
        });

        this.grid.getEvent('dragEnd', null, null, (item, e) => {
            // console.log('drag end');
            // console.log(this.gridElement);
            // console.log(e);

            e.preventDefault();

            let originalWords = this.state.words;
            let newWords = [];
            let it = this.grid.getMethod('getItems');
            for (let i = 0; i < it.length; i++) {
                // console.log(it[i].getElement());
                let wordIdx = parseInt(it[i].getElement().getAttribute('data-id'));
                newWords.push(originalWords[wordIdx]);
            }

            // console.log('new words');
            // console.log(newWords);

            if (!isEqual(this.state.words, newWords)) {
                // to check if it is the user chaning the words, or simply the sentence is just loaded
                if (this.state.words.length > 0) {
                    this.onTextChange({
                        opt: 'exchange',
                        sentence: newWords.map(w => w.token).join(' '),
                    });
                }

                this.setState({
                    words: newWords,
                    selectedWordIdx: null,
                });
            }
        });

        // this.grid.getEvent('layoutStart', null, null, items => {
        //     console.log('layout');
        // });
    }

    componentDidMount() {
        // console.log('did mount');
        this.createMuuri();
    }

    componentWillUnmount() {
        this.grid.getMethod('destroy'); // Required: Destroy the grid when the component is unmounted.
    }

    removeElement() {
        // An example of how to use `getMethod()` to remove an element from the grid.
        if (this.gridElement && this.gridElement.children.length) {
            this.grid.getMethod('remove', this.gridElement.children[0], { removeElements: true });
        }
    }

    deleteRow = props => {
        // console.log(props.item);
        // if (this.gridElement && this.gridElement.children.length) {
        //     // console.log(this.gridElement);
        //     // this.gridElement.children.((o) => console.log(o));
        //     // this.grid.getMethod('remove', this.gridElement.children[0], {removeElements: true});
        // }
        let words = this.state.words.filter(
            //   ({ id }) => id !== parseInt(props.item_id.substr(5), 10)
            (word, id) => id !== props.item_id,
        );

        this.setState({
            words,
        });

        this.onTextChange({
            opt: 'delete',
            sentence: words.map(w => w.token).join(' '),
        });

        this.grid.getMethod('refreshItems');
        this.grid.getMethod('layout');

        // if (this.gridElement && this.gridElement.children.length) {
        //     this.grid.getMethod('remove', this.gridElement.children[props.item_id], {removeElements: true});
        // }
    };

    // showHint = (props) => {
    //   if (this.state.selectedWordIdx !== props.item_id) {
    //     let sentence = this.state.words.map(w => w.token).join(' ');
    //     this.props.onFetchHint(sentence, props.item_id, model)
    //     this.setState({
    //       selectedWordIdx: props.item_id
    //     })
    //   }
    // }

    showHint = (props, model) => {
        if (this.state.selectedWordIdx !== props.item_id || this.state.selectHintModel !== model) {
            let sentence = this.state.words.map(w => w.token).join(' ');
            this.props.onFetchHint(sentence, props.item_id, model);
            this.setState({
                selectedWordIdx: props.item_id,
                selectHintModel: model,
            });
        }
    };

    handleContextMenu(e) {
        // always prevent default behavior
        e.preventDefault();

        try {
            let payload = parseInt(e.currentTarget.dataset.id, 10);
            // demoData.forEach(item => {
            //   if (item.id === parseInt(e.currentTarget.dataset.id, 10)) {
            //     payload = item;
            //   }
            // });

            if (!isNaN(payload)) {
                // console.log('payload');
                // console.log(payload);
                // Don't forget to pass the id and the event and voila!
                contextMenu.show({
                    id: 'menu_id',
                    event: e,
                    props: {
                        item_id: payload,
                    },
                });
            }
        } catch (err) {}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Typical usage (don't forget to compare props):
        // console.log('did update');
        // console.log(prevState.words);
        // console.log(this.state.words);

        // console.log(this.gridElement)
        if (!isEqual(this.props.words, prevProps.words)) {
            this.setState({
                words: this.props.words,
                selectedWordIdx: null,
                selectHintModel: null,
            });
        } else if (!isEqual(prevState.words, this.state.words)) {
            // console.log('recreating');
            this.grid.getMethod('destroy');
            this.createMuuri();
        } else {
            this.grid.getMethod('refreshItems');
            this.grid.getMethod('layout');
        }

        if (this.selfInputRef.current) {
            let sentence = this.state.words.map(w => w.token).join(' ');
            this.selfInputRef.current.value = sentence;
        }
    }

    getTextWidth = function(text, font) {
        // re-use canvas object for better performance
        var canvas =
            getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
        var context = canvas.getContext('2d');
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    };

    getItemWidth(word) {
        return Math.max(word.length * 20, 80) + 'px';
    }

    onValueChange = (idx, newContent) => {
        let newWords = newContent.split(' ').map(w => {
            return {
                token: w,
                weight: 0,
            };
        });
        // console.log(newWords);
        let words = this.state.words.slice(0);
        words.splice(idx, 1); // remove the old element
        words.splice(idx, 0, ...newWords);

        this.setState({
            words: words,
        });

        this.onTextChange({
            opt: 'edit',
            sentence: words.map(w => w.token).join(' '),
        });
    };

    notice2 = (idx, newContent) => {
        console.log('notice');
        if (this.gridElement && this.gridElement.children.length) {
            // this.grid.getMethod('remove', this.gridElement.children[0], {removeElements: true});
            // console.log(this.gridElement.children);
            this.gridElement.children[idx].style.width = this.getItemWidth(newContent);
            let ch = this.gridElement.children;
            let a = this.gridElement.children[idx];
            // let b = React.cloneElement(a);
            // let b = Object.assign({}, a);
            let b = a.cloneNode(true);
            b['onKeyDown'] = a['onKeyDown'];
            b.children[0].textContent = 'new node';
            b.attributes['data-id'] = 'word-100';
            this.grid.getMethod('add', [b], { index: 0 });
        }

        let it = this.grid.getMethod('getItems');
        it.forEach(function(item, i) {
            item.getElement().setAttribute('data-id', i);
        });

        //   this.grid.getMethod('getItems').forEach(function (item, i) {
        //     item.getMethod('getElement').setAttribute('data-id', i + 1);
        //   })

        this.grid.getMethod('refreshItems');
        this.grid.getMethod('layout');
    };

    createItem = (word, weight, idx) => {
        var Editablediv = EditableDiv('div');
        return (
            <div
                data-id={idx}
                key={'word-' + idx}
                className="item"
                onContextMenu={this.handleContextMenu}
            >
                {/* <div className="item-content" >{word.token}</div> */}
                <Editablediv
                    className="item-content"
                    value={word}
                    onSave={true}
                    onValueChange={this.onValueChange}
                    idx={idx}
                    style={{ color: 'black', background: getWeightColor(weight) }}
                />
            </div>
        );
        //   return <div data-id={'word-' + idx} key={'word-' + idx} className="item" style={{width:Math.max(word.token.length * 30, 80) + "px    //   </div>
    };

    changeWord = () => {
        this.gridElement.children[0].children[0].textContent = 'changed';
        this.gridElement.children[0].style.width = this.getItemWidth('changed');
        this.grid.getMethod('refreshItems');
        this.grid.getMethod('layout');
    };

    addWord = () => {
        let words = this.state.words.slice(0);
        words.push({
            token: 'new node',
            weight: 0,
        });
        this.setState({
            words: words,
        });
    };

    show = () => {
        let str = '';
        let it = this.grid.getMethod('getItems');
        for (let i = 0; i < it.length; i++) {
            str += it[i].getElement().children[0].textContent;
            str += ' ';
        }
    };

    applySuggestion = w => {
        let { selectedWordIdx } = this.state;
        let words = [...this.state.words];
        words[selectedWordIdx] = {
            token: w,
            weight: 0,
        };
        this.setState({
            words: words,
            selectedWordIdx: null,
        });

        this.onTextChange({
            opt: 'recommendation',
            sentence: words.map(w => w.token).join(' '),
        });
    };

    makeSelfInput = e => {
        // split by major punctuations, the splition rule is relaxed here for human inputs
        if (!this.selfInputRef.current) {
            return;
        }

        let sentence = this.selfInputRef.current.value;
        // let words = sentence.split(/[\s,\.]+/);
        // let words = sentence.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ');
        let words = sentence
            .replace(/[\s,\.]|_/g, function($1) {
                return ' ' + $1 + ' ';
            })
            .replace(/[ ]+/g, ' ')
            .split(' ');
        words = words.filter(w => w.trimEnd());
        words = words.map(w => ({
            token: w,
            weight: 0,
        }));
        this.setState({
            words: words,
            selectedWordIdx: null,
        });

        this.onTextChange({
            opt: 'manual',
            sentence: words.map(w => w.token).join(' '),
        });
    };

    render() {
        // console.log('render');
        // console.log(this.state.words);
        var Editablediv = EditableDiv('div');
        var Editableh1 = EditableDiv('h1');
        var { words, selectedWordIdx } = this.state;
        let sentence = words.map(w => w.token).join(' ');

        return (
            <div sytle={{ marginTop: '15px' }}>
                {this.props.auxiliary && (
                    <div>
                        {/* <Badge
                            color="primary"
                            //  variant="dot"
                        >
                            <Typography>Recommendations: {selectedWordIdx}</Typography>
                        </Badge> */}
                        <SuggestionPanel
                            onClick={w => {
                                this.applySuggestion(w);
                            }}
                            available={selectedWordIdx !== null}
                            hint={this.props.hint}
                            loading={this.props.hintLoading}
                        />
                    </div>
                )}

                <div
                    className="grid grid-1"
                    onContextMenu={this.handleContextMenu}
                    style={{ display: this.props.auxiliary ? 'block' : 'none' }}
                >
                    {/* Assign a ref to the grid container so the virtual DOM will ignore it for now (WIP). */}
                    <div
                        ref={gridElement => {
                            // console.log('rebind gridElement');
                            // console.log(gridElement);
                            this.gridElement = gridElement;
                        }}
                    >
                        {words.map((w, idx) => this.createItem(w.token, w.weight, idx))}
                    </div>

                    {/* {this.createItem(a, 0)} */}
                    {/* <button onClick={this.changeWord}>Click to change</button>
                      <button onClick={this.addWord}>Click to add</button>
                      <button onClick={this.show}>Click to show</button>
                      <button onClick={() => {
                        this.onValueChange(1, "yes no")
                      }}>Click to insert</button> */}
                    <MyAwesomeMenu
                        deleteRow={({ props }) => {
                            this.deleteRow(props);
                        }}
                        showHintLM={({ props }) => {
                            this.showHint(props, 'language_model');
                        }}
                        showHintSemantic={({ props }) => {
                            this.showHint(props, 'semantic');
                        }}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        id="standard-uncontrolled"
                        // label="Uncontrolled"
                        defaultValue={sentence}
                        // className={classes.textField}
                        InputProps={{
                            style: {
                                fontSize: '24px',
                            },
                        }}
                        margin="normal"
                        style={{ width: '82%', marginLeft: '10px' }}
                        inputRef={this.selfInputRef}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        primary="true"
                        onClick={e => this.makeSelfInput()}
                        style={{ margin: '10px', marginLeft: 'auto' }}
                    >
                        Type Your Edit
                    </Button>
                </div>
                {/* <div style={{display: 'flex', alignItems: "center"}}>
                  <Typography variant="h3">Origin: </Typography>
                  <Typography variant="h5">{this.props.origin}</Typography>
                 </div> */}
                <Chip
                    size="medium"
                    label={this.props.origin}
                    color="primary"
                    style={{ marginLeft: '10px', marginTop: '5px' }}
                    // onDelete={handleDelete}
                    // className={classes.chip}
                />
            </div>
        );
    }
}

export default TextGrid;
