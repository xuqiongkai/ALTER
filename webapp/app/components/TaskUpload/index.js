/**
 *
 * TaskUpload
 *
 */

import React, { memo } from 'react';
import { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Dropzone from "react-dropzone";
import { Field, reduxForm } from 'redux-form/immutable';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '80%'
  },

  container: {
    fontSize: "1rem",
    textAlign: "center",
    width: "30%"
  },

  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: '2px',
    borderRadius: '2px',
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  },

  dropzone2: {
    transform: 'translate(40%, 0px)',
    height: '200px',
    width: '200px',
    backgroundColor: '#fff',
    border: '2px dashed rgb(187, 186, 186)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: '16px',
    cursor: 'pointer',
  },

  highlight: {
    backgroundColor: 'rgb(188, 185, 236)',
  },

  dropIcon: {
    opacity: 0.3,
    height: '64px',
    width: '64px',
  },

  panel: {
    marginRight: 'auto',
    width: '70%',
  },

  text: {
    margin: "3px",
    marginTop: "20px",
    marginBottom: "10px",
  },

  button: {
    margin: "3px",
    marginTop: "5px",
  },

  field: {
    margin: "2px"
  }

  // .FileInput {
  //   display: none;
  // }
}));

function TaskUpload(props) {
  const classes = useStyles();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  function createTask(e) {
    e.preventDefault()
    if (files.length == 0) {
      setError('Please select a file');
      return;
    }

    if (!name) {
      setError('Please specify the task name')
      return
    }

    // console.log(files[0])
    props.onSubmit(name, files[0])
  }

  return (<div>
    <form className={classes.root} onSubmit={createTask}>
      <div className={classes.panel}>
        <TextField className={classes.field} label="Task Name" fullWidth onChange={e => setName(e.target.value)}></TextField>
        <TextField className={classes.field} label="Task Description" fullWidth onChange={e => setDescription(e.target.value)}></TextField>
        <Typography className={classes.text} variant="h5">Selected File: {(files.length > 0) ? files[0].path : ""}</Typography>
        <Button className={classes.button} variant="contained" color="primary" type="submit">Create</Button>
        <Typography className={classes.text} variant="h1" style={{color: "#f35454"}}>{error}</Typography>
      </div>

      <Dropzone onDrop={acceptedFiles => setFiles(acceptedFiles)} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <section className={classes.container}>
            <div {...getRootProps({ className: classes.dropzone2 })}>
              <input {...getInputProps()} />
              <CloudUploadIcon className={classes.dropIcon}></CloudUploadIcon>
              <p>Click to select file</p>
            </div>
            {/* <aside>
              <h4>Files</h4>
              <ul>{files.map(f => f.path)}</ul>
            </aside> */}
          </section>
        )}
      </Dropzone>


    </form>
  </div>
  );
}

export default memo(TaskUpload);

// const useStyles = makeStyles(theme => ({
//     upload: {
//         display: 'flex',
//         flexDirection: 'column',
//         flex: 1,
//         alignItems: 'flex-start',
//         textAlign: 'left',
//         overflow: 'hidden'
//     },

//     content: {
//         display: 'flex',
//         flexDirection: 'row',
//         paddingTop: '16px',
//         boxSizing: 'border-box',
//         width: '100%',
//     },

//     files: {
//         marginLeft: '32px',
//         alignItems: 'flex-start',
//         justifyItems: 'flex-start',
//         flex: 1,
//         overflowY: 'auto'
//     },

//     actions: {
//         display: 'flex',
//         flex: 1,
//         width: '100%',
//         alignItems: 'flex-end',
//         flexDirection: 'column',
//         marginTop: '32px',
//     },

//     title: {
//         marginTop: '32px',
//         'color': '#555',
//     }

// }));

// class Upload extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       files: [],
//       uploading: false,
//       uploadProgress: {},
//       successfullUploaded: false
//     };

//     this.onFilesAdded = this.onFilesAdded.bind(this);
//     this.uploadFiles = this.uploadFiles.bind(this);
//     this.sendRequest = this.sendRequest.bind(this);
//     this.renderActions = this.renderActions.bind(this);
//   }

//   render() {
//       const classes = useStyles();

//     return (
//       <div className={classes.upload}>
//         <span className={classes.title}>Upload Files</span>
//         <div className={classes.content}>
//           <div>
//             <Dropzone
//               onFilesAdded={this.onFilesAdded}
//               disabled={this.state.uploading || this.state.successfullUploaded}
//             />
//           </div>
//           <div className={classes.files}>
//             {this.state.files.map(file => {
//               return (
//                 <div key={file.name} className="Row">
//                   <span className="Filename">{file.name}</span>
//                   {this.renderProgress(file)}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className="Actions">{this.renderActions()}</div>
//       </div>
//     );
//   }
// }

// TaskUpload.propTypes = {};
// export default memo(TaskUpload);
