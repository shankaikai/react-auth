import React from "react";
import Axios from "axios";

export default function TenantPage() {
  const userAuthenticated = () => {
    // Check if authenicated
    Axios.get("http://localhost:3001/isUserAuth", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      Tenant Page
      <button onClick={userAuthenticated}>Check user authenicated</button>
    </div>
  );
}
