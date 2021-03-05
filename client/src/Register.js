import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

const Register = () => {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [userTypeReg, setUserTypeReg] = useState("staff");

  // Very important!
  Axios.defaults.withCredentials = true;

  const register = () => {
    // Check if blank
    if (usernameReg == "" || passwordReg == "") {
      alert("Username/Password cannot be empty!");
      return;
    }

    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
      type: userTypeReg,
    }).then((response) => {
      console.log(response);
      if (response.data.messageExists) {
        alert("Username is taken!");
      } else if (response.data.message) {
        alert("Registration successful!");
      } else {
        alert("Server error!");
      }
    });
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <label>Username</label>
      <input
        type="text"
        onChange={(e) => {
          setUsernameReg(e.target.value);
        }}
      ></input>
      <label>Password</label>
      <input
        type="text"
        onChange={(e) => {
          setPasswordReg(e.target.value);
        }}
      ></input>
      <label>User Type</label>
      <select
        onChange={(e) => {
          setUserTypeReg(e.target.value);
        }}
        defaultValue="staff"
      >
        <option value="staff">Staff</option>
        <option value="tenant">Tenant</option>
      </select>
      <button onClick={() => register()}>Register</button>
      <button>
        <Link to="/">Back</Link>
      </button>
    </div>
  );
};

export default Register;
