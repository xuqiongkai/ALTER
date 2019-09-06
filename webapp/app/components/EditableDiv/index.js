import React from 'react';
import { render } from 'react-dom';

function EditableDiv(WrappedComponent) {

    return class extends React.Component {

      constructor (props) {
          super(props);
          this.onValueChange = props.onValueChange;
          this.lastValue = props.value;
      }
 
      state = {
        editing: false
      }
  
      toggleEdit = (e) => {
        e.stopPropagation();
        if (this.state.editing) {
            // console.log('cancel')
          this.cancel();
        } else {
            // console.log('edit')
          this.edit();
        }
      };
  
      edit = () => {
        this.setState({
          editing: true
        }, () => {
          this.domElm.focus();
        });
      };
  
      save = () => {
        this.setState({
          editing: false
        }, () => {
          if (this.props.onSave && this.isValueChanged()) {
            // console.log('Value is changed', this.domElm.textContent);
         }
          if (this.isValueChanged()) {
            if (this.onValueChange !== null) {
                this.onValueChange(this.props.idx, this.domElm.textContent);
            }
 
          }
          this.lastValue = this.domElm.textContent;
        });
      };
  
      cancel = () => {
        this.setState({
          editing: false
        });
      };
  
      isValueChanged = () => {
        // return this.props.value !== this.domElm.textContent
        return this.lastValue !== this.domElm.textContent;
      };
  
      handleKeyDown = (e) => {
        const { key } = e;
        // console.log('key ' + key)
        switch (key) {
          case 'Enter':
          case 'Escape':
            this.save();
            break;
        }
      };
  
      render() {
        let editOnClick = true;
        const {editing} = this.state;
        // if (this.props.editOnClick !== undefined) {
        //   editOnClick = this.props.editOnClick;
        // }
        // console.log(this.props);
        let {onSave, onValueChange, ...other_props} = this.props;
        return (
          <WrappedComponent
            className={editing ? 'editing' : ''}
            onClick={editOnClick ? this.toggleEdit : undefined}
            // contentEditable={editing}
            ref={(domNode) => {
                this.domElm = domNode;
                if (domNode != null) {
                    domNode.contentEditable = true;
                }
            }}
            onBlur={this.save}
            onKeyDown={this.handleKeyDown}
            {...other_props}
        >
          {this.props.value}
        </WrappedComponent>
        )
      }
    }
  }
  

export default EditableDiv;