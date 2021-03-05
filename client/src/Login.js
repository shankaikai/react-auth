import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  let history = useHistory();

  // Very important!
  Axios.defaults.withCredentials = true;

  const login = () => {
    // Check if blank
    if (username === "" || password === "") {
      alert("Username/Password cannot be empty!");
      return;
    }
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      // Check if invalid, in this case invalid means message exists
      if (!response.data.auth) {
        alert(response.data.message);
        // setLoginStatus(response.data.message);
      } else {
        console.log(response.data);
        // setLoginStatus(response.data[0].username);
        // Store with Bearer in front of the token
        localStorage.setItem("token", response.data.token);
        history.push("/");
      }
    });
  };

  // Run everytime we go to the link
  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      console.log(response);
      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].username);
        history.push("/");
      }
    });
  }, []);

  return (
    <div className="login">
      <h1>Login</h1>
      <label>Username</label>
      <input
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      ></input>
      <label>Password</label>
      <input
        type="text"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <button onClick={() => login()}>Login</button>
      <button>
        <Link to="/register">Register</Link>
      </button>
      <h2>{loginStatus}</h2>
    </div>
  );
};

export default Login;
