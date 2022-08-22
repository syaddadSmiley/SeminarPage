import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import RemoveCookie from "../../../hooks/RemoveCookie";

function AdminNavbar() {
  let navigate = useNavigate();
  const logoutHanlder = async () => {
    // remove token
    RemoveCookie("token");
    // console.log(token)
    localStorage.removeItem("user-info");
    localStorage.removeItem("TOKEN");
    //redirect halaman login
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className="navbar fixed-top bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand ms-5 navbar-brand-custom" to="/home">
            <span className="text-ladang">Ladang </span>
            <span className="text-materi">Materi</span>
          </NavLink>

          <h3>Admin Page</h3>

          <div className="container-nav">
            <button onClick={logoutHanlder} className="btn btn-danger btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
