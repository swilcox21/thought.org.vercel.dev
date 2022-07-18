/* eslint-disable no-unused-vars */
import '../App.css';
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';

function Reminder(props) {
  const [thought, setThought] = useState(props.thought.thought);
  const [folder, setFolder] = useState(props.folder);
  const [dashboard, setDashboard] = useState(props.thought.dashboard);
  const [allFolders, setAllFolders] = useState(props.allFolders);
  const [folderValue, setFolderValue] = useState('');
  const [folderPlaceholder, setFolderPlaceholder] = useState('');

  return (
    <>
      <div className="d-flex justify-content-center mx-auto">
        <TextareaAutosize
          id="textareaautosize"
          className=" activeTodo borderNone py-1 pl-2"
          placeholder="Type your Thought here"
          type="text"
          defaultValue={props.thought.thought}
          onChange={(e) => {
            setThought(e.target.value);
            setDashboard(props.thought.dashboard);
          }}
          onBlur={(e) =>
            thought !== props.thought.thought &&
            props.thoughtPut(props.thought.id, thought, props.thought.dashboard, props.folder.id)
          }
        />
        <div className="dropleft">
          <span
            className=""
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            &nbsp;&nbsp;
            <i className="fas fa-cog"></i>
          </span>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <div
              className="text-center"
              onClick={() =>
                props.thoughtPut(
                  props.thought.id,
                  props.thought.thought,
                  !props.thought.dashboard,
                  props.thought.folder.id,
                )
              }
            >
              DB
            </div>
            <input
              className="borderRight"
              placeholder={props.folder.name}
              defaultValue={folderPlaceholder}
              value={folderPlaceholder}
              onChange={(e) => {
                setFolderValue(e.target.value);
                setThought(props.thought.thought);
                setFolderPlaceholder(e.target.value);
                setFolder(allFolders.filter((folder) => folder.name === e.target.value));
              }}
              onBlur={(e) =>
                folder.length === 0
                  ? props.folderPost(
                      folderValue,
                      props.thought.id,
                      props.thought.thought,
                      props.thought.dashboard,
                    )
                  : folder[0].id !== props.folder.id
                  ? props.thoughtPut(
                      props.thought.id,
                      props.thought.thought,
                      props.thought.dashboard,
                      folder[0].id,
                    )
                  : setFolderPlaceholder('')
              }
              list="folders"
              name="folder"
              id="folder"
            />
            <datalist id="folders">
              {allFolders.length > 0 &&
                allFolders.map((folder) => (
                  <div key={folder.id}>
                    <option value={folder.name} />
                  </div>
                ))}
            </datalist>
            <div className="text-center" onClick={() => props.thoughtDelete(props.thought.id)}>
              X
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reminder;
// vercel
Reminder.propTypes = {
  thought: PropTypes.object,
  folder: PropTypes.object,
  allFolders: PropTypes.array,
  allThoughts: PropTypes.array,
  thoughtPut: PropTypes.func,
  folderPost: PropTypes.func,
  thoughtDelete: PropTypes.func,
};
