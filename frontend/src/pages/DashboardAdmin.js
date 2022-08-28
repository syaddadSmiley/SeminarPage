import React, { useState } from "react";
import "boxicons";
import "../style/DashboardAdmin.css";
import Avatar from "../assets/images/kelas-1.jpg";
import NavSiswa from "../components/NavAdmin";
// import CardAdmin from "../components/admin";
import { Link } from "react-router-dom"
import "../style/NavAdmin.css";

export default function DashboardAdmin() {

  return (
    <div className="container-all-kelas-1">
        <div className="container-all-kelas-2">
            <NavSiswa />
            <div className="container-all-kelas">
            <h1>Welcome Admin</h1>
                <div className="container-kelas">
                    {/* <CardKelas /> */}
                </div>
            </div>
        </div>
    </div>
  );
}
