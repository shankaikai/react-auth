import React, { useState, useEffect } from "react";
import Axios from "axios";
import StaffPage from "./StaffPage";
import TenantPage from "./TenantPage";
import { Redirect, useHistory } from "react-router-dom";

export default function Main() {
  // User role
  const [type, setType] = useState("");

  Axios.defaults.withCredentials = true;
  let history = useHistory();

  // Check if logged in else redirect to login
  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      console.log(response);
      if (response.data.loggedIn === true) {
        setType(response.data.user[0].type);
      } else {
        history.push("/login");
      }
    });
  }, []);

  return (
    <div>
      {type === "staff" && <StaffPage />}
      {type === "tenant" && <TenantPage />}
    </div>
  );
}
