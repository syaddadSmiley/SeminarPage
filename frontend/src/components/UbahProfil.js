import React, { useState } from "react";
import "boxicons";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/UbahProfil.css";
// import ProfIcon from "../assets/images/profil-icon.svg";
// import Avatar2 from "../assets/images/Ani.png";
// import Avatar3 from "../assets/images/Adi.png";
// import NavSiswa from "./NavSiswa";
import { Link } from "react-router-dom"

export default function UbahProfil() {
    return(
        <div className="container-all-edit-1">
            <div className="container-all-edit-2">
                {/* <NavSiswa /> */}
                <div className="container-all-edit">
                <h1>Profil</h1>
                    <div className="container-edit">
                        <div className="card-edit">
                            <div className="content-edit">
                                <div className="details-edit">
                                    <h2>Foto Profil</h2>
                                    <div className="card" aria-label="Post Card">
                                    <img src={'https://dubaitrippackages.files.wordpress.com/2017/11/2-imgdinosaurs_base.jpg'} className="card-image-top" style={{ maxHeight: '300px', objectFit: "cover" }} />
                                    </div>
                                </div>
                                <div class="upload">
                                    <input type="file" name="prof-pic" id="prof-pic" class="file_upload avatar-image" accept="image/jpg, image/jpeg, image/png"/>
                                    <br/><small class="form-text text-red text-muted">Format .jpg, .png</small>
                                </div>
                            </div>
                            <div className="content-edit">
                                <div className="details-edit">
                                    <h2>Nama</h2>
                                </div>
                                <div class="upload">
                                    <input type="text" name="edit-name" id="edit-name" class="text_upload name"/>
                                </div>
                            </div>
                            <div className="content-edit">
                                <div className="details-edit">
                                    <h2>Email</h2>
                                </div>
                                <div class="upload">
                                    <input type="text" name="edit-email" id="edit-email" class="text_upload email"/>
                                </div>
                            </div>
                            <div className="content-edit">
                                <div className="details-edit">
                                    <h2>Telepon</h2>
                                </div>
                                <div class="upload">
                                    <input type="text" name="edit-phone" id="edit-phone" class="text_upload phone"/>
                                </div>
                            </div>
                            <div className="UbahProfil btn-submit text-center">
                                <Link to="/kelas-saya">
                                    <button type="submit" class="mt-2 btn btn-primary btn-lg button-submit primer-btn">Simpan</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}