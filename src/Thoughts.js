/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Folder from './components/folder';
import Thought from './components/thought';
import NewThought from './components/newThought';
import Navbar from './components/navbar2';
import Dashboard from './components/dashboard';
import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';

const clientId = '1007332775808-q4j6sklcv5oi9stfl9j35etdvorooj9m.apps.googleusercontent.com';

function Thoughts() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem('loginData') ? localStorage.getItem('authToken') : null,
  );
  const [allFolders, setAllFolders] = useState([]);
  const [allThoughts, setAllThoughts] = useState([]);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData') ? localStorage.getItem('loginData') : null,
  );
  // google-login functions
  const handleFailure = (result) => {
    alert(result);
    console.log('handleFailure:', result);
  };
  const handleLogin = (res) => {
    console.log('loginSuccess:', res.profileObj);
    setLoginData(res.profileObj.email);
    localStorage.setItem('loginData', res.profileObj.email);
  };

  // local storage logout function
  const handleLogout = () => {
    localStorage.removeItem('loginData');
    localStorage.removeItem('authToken');
    setUserData([]);
    setAllThoughts([]);
    setAllFolders([]);
    setAuthToken(null);
    setLoginData(null);
  };

  // onLoad Get Requests
  useEffect(() => {
    function start() {
      localStorage.getItem('loginData') && setLoginData(localStorage.getItem('loginData'));
      gapi.client.init({
        clientId: clientId,
        scope: '',
      });
    }
    gapi.load('client:auth2', start);
    axios.get('http://127.0.0.1:8000/user/' + loginData).then((res) => {
      setUserData(res.data);
      localStorage.setItem('loginData', res.data.username);
      setAllFolders(res.data.folders);
      res.data.folders.map((folder, index) =>
        setAllThoughts((prevThots) => prevThots.concat(folder.thought)),
      );
    });
  }, [loginData]);

  // Post Requests
  async function getUser(username, password) {
    setLoading(true);
    const data = {
      username: username,
      password: password,
    };
    await axios
      .post('http://127.0.0.1:8000/auth/', data)
      .then((res) => {
        setLoading(false);
        localStorage.setItem('authToken', res.data.token);
        // setAuthToken(res.data.token);
        axios.get('http://127.0.0.1:8000/user/' + username).then((res) => {
          setUserData(res.data);
          localStorage.setItem('loginData', res.data.username);
          setAllFolders(res.data.folders);
          res.data.folders.map((folder, index) =>
            setAllThoughts((prevThots) => prevThots.concat(folder.thought)),
          );
        });
      })
      .catch((error) => {
        // console.log(error && 'user not found please register');
        alert(error && 'USER DOES NOT EXIST GO AWAY!!');
      });
  }
  async function newThoughtPost(name, thought) {
    setLoading(true);
    const data = {
      name: name,
      thought: [thought],
    };
    await axios
      .post('http://127.0.0.1:8000/folder', data)
      .then((response) => {
        setLoading(false);
        axios.get('http://127.0.0.1:8000/user').then(function (response) {
          setUserData(response.data);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  async function folderPost(name, thought_id, thought, dashboard) {
    setLoading(true);
    const data = {
      name: name,
      thought: [thought],
    };
    await axios
      .post('http://127.0.0.1:8000/folder/new/', data)
      .then((response) => {
        setLoading(false);
        thoughtPut(thought_id, thought, dashboard, response.data.id);
        axios.get('http://127.0.0.1:8000/user').then(function (response) {
          setUserData(response.data);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  async function thoughtPost(thought, folder_id) {
    setLoading(true);
    const data = {
      thought: thought,
      folder: folder_id,
    };
    await axios
      .post('http://127.0.0.1:8000/thought', data)
      .then((response) => {
        setLoading(false);
        axios.get('http://127.0.0.1:8000/thought').then(function (response) {
          setAllThoughts(response.data);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  // Put Requests
  async function folderPut(folder_id, name, dashboard, toggle) {
    setLoading(true);
    const data = {
      name: name,
      dashboard: dashboard,
      toggle: toggle,
    };
    await axios
      .put('http://127.0.0.1:8000/folder/' + folder_id, data)
      .then(function (response) {
        setLoading(false);
        axios.get('http://127.0.0.1:8000/user/' + loginData).then(function (response) {
          setAllFolders(response.data.folders);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  async function thoughtPut(thought_id, thought, dashboard, folder_id) {
    setLoading(true);
    const data = {
      thought: thought,
      dashboard: dashboard,
      folder: folder_id,
    };
    await axios
      .put('http://127.0.0.1:8000/thought/' + thought_id, data)
      .then(function (response) {
        setLoading(false);
        axios.get('http://127.0.0.1:8000/thought').then(function (response) {
          setAllThoughts(response.data);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  // delete requests
  async function thoughtDelete(thought_id) {
    await axios.delete('http://127.0.0.1:8000/thought/' + thought_id).then((response) =>
      axios.get('http://127.0.0.1:8000/thought').then(function (response) {
        setAllThoughts(response.data);
      }),
    );
  }
  async function folderDelete(thought_id) {
    await axios
      .delete('http://127.0.0.1:8000/folder/' + thought_id)
      .then((response) => {
        setLoading(false);
        axios.get('http://127.0.0.1:8000/user').then(function (response) {
          setUserData(response.data);
        });
        axios.get('http://127.0.0.1:8000/thought').then(function (response) {
          setAllThoughts(response.data);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  // HTML code
  return (
    <>
      {localStorage.getItem('authToken') ? (
        <>
          <button className="logoutButton" onClick={handleLogout}>
            logout
          </button>
          hi
          <Navbar userData={userData} allFolders={allFolders} folderPut={folderPut} />
          <div className="App container-fluid col-md-8 col-lg-6 col-xl-5">
            <br />
            <br />
            {/* DASHBOARD */}
            {allThoughts.length > 0 &&
              allThoughts
                .filter((thought) => thought.dashboard === true)
                .map((thot, index) => (
                  <div key={thot.id} className="my-3">
                    <Dashboard
                      thoughtPut={thoughtPut}
                      thought={thot}
                      folder={thot.folder}
                      allThoughts={allThoughts}
                      thoughtDelete={thoughtDelete}
                      userData={userData}
                      allFolders={allFolders}
                    />
                    <br />
                  </div>
                ))}
            {/* NEW THOUGHT */}
            <div className="my-3">
              {allFolders.length > 0 && (
                <NewThought
                  newThoughtPost={newThoughtPost}
                  userData={userData}
                  allFolders={allFolders}
                  allThoughts={allThoughts}
                />
              )}
            </div>
            {/* REMINDERS DASHBOARD */}
            {allThoughts.length > 0 &&
              allThoughts
                .filter(
                  (thought) => (thought.dashboard !== true) & (thought.folder.name === 'reminders'),
                )
                .map((thought, index) => (
                  <div key={thought.id}>
                    <Thought
                      folderPost={folderPost}
                      thoughtPut={thoughtPut}
                      thought={thought}
                      folder={thought.folder}
                      userData={userData}
                      allFolders={allFolders}
                      allThoughts={allThoughts}
                      thoughtDelete={thoughtDelete}
                    />
                  </div>
                ))}
            {/* ALL OTHER FOLDERS DASHBOARD */}
            <br />
            <br />
            <br />
            <div className="borderBottom mb-3"></div>
            {allFolders.length > 0 &&
              allFolders
                .filter((folder) => (folder.dashboard === true) & (folder.name !== 'reminders'))
                .map((folder, index) => (
                  <div key={folder.id}>
                    <Folder
                      folderPost={folderPost}
                      thoughtPost={thoughtPost}
                      thoughtPut={thoughtPut}
                      folderPut={folderPut}
                      folderDelete={folderDelete}
                      thoughtDelete={thoughtDelete}
                      folder={folder}
                      userData={userData}
                      allFolders={allFolders}
                      allThoughts={allThoughts}
                    />
                  </div>
                ))}
          </div>
        </>
      ) : (
        <div className="loginContainer">
          <div className="loginCard">
            <h2>Welcome to Thought.org!</h2>
            <p>please log in</p>
            <img
              src="https://github.com/swilcox21/Thot.Org/blob/main/src/front/img/looping-down-arrows.gif?raw=true"
              alt=""
            />
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <br />
            <br />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <br />
            <input type="checkbox" onClick={() => setShowPassword(!showPassword)} />
            <br />
            <br />
            <input
              type="submit"
              value="LOGIN"
              onClick={() => getUser(loginUsername, loginPassword)}
            />
            <div className="loginButton">
              {/* <GoogleLogin
                clientId={clientId}
                buttonText="Log in with Google"
                onSuccess={handleLogin}
                onFailure={handleFailure}
                cookiePolicy={'single_host_origin'}
              ></GoogleLogin> */}
            </div>
            <br />
            <small>If you do not have google go away</small>
          </div>
        </div>
      )}
    </>
  );
}

export default Thoughts;
