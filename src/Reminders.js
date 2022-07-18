/* eslint-disable no-unused-vars */
import './App.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import TextareaAutosize from 'react-textarea-autosize';

function Reminders(props) {
  //   const [thought, setThought] = useState(props.thought.thought);
  //   const [folder, setFolder] = useState(props.folder);
  //   const [dashboard, setDashboard] = useState(props.thought.dashboard);
  const [allFolders, setAllFolders] = useState(props.allFolders);
  //   const [folderValue, setFolderValue] = useState('');
  //   const [folderPlaceholder, setFolderPlaceholder] = useState('');

  return (
    <>
      <h1>hello world </h1>
      {props.allFolders.map((folder, index) => (
        <div key={folder.id}>{folder.name}</div>
      ))}
    </>
  );
}

export default Reminders;
// vercel
Reminders.propTypes = {
  thought: PropTypes.object,
  folder: PropTypes.object,
  allFolders: PropTypes.array,
  allThoughts: PropTypes.array,
  thoughtPut: PropTypes.func,
  folderPost: PropTypes.func,
  thoughtDelete: PropTypes.func,
};
