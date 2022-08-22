import React, { useState, useEffect } from "react"
import axios from 'axios';
import { Link } from "react-router-dom";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../style/Home.css';
import '../style/Tentang.css';
import '../App.css';
import Navbar from './Navigation';
import Footer from './Footer';

function Tentang() {
    return (
        <div className="About">
            <Navbar />
            <div className="container my-5">
                <h3>Tentang Kami</h3>
                <p>PT Hallo Raya Indonesia, melakukan bisnis sebagai Halloguru, adalah sebuah perusahaan rintisan digital asal Indonesia untuk anak berkebutuhan khusus yang bergerak di bidang pendidikan nonformal.
                    Halloguru menawarkan platform pembelajaran berbasis kurikulum sekolah melalui video tutorial interaktif oleh guru dan atau mendatangi guru ke rumah secara langsung. Perusahaan ini didirikan oleh Amalia Suherman, Dinda Wahyu Rahmadani, Fermi Naufal Akbar, Gilang Safera Putra, dan Shafa Salsabilla Buchori pada Juni 2022.</p>
            </div>

            <section id="team" className="teamXXX content-section">
                <div className="container">
                    <div className="row text-center">
                        <div className="container">
                            <div className="row tentang-row">
                                <div className="col-md-4">
                                    <div className="team-member">
                                        <figure>
                                            <img
                                                src="http://www.mauritiusdsilva.com/themes/hallooou/assets/images/jessie-barnett.jpg"
                                                alt="" className="img-responsive" />
                                            <figcaption>
                                                <p>Temporibus dolor, quisquam consectetur molestias, veniam voluptatum.
                                                    Beatae alias omnis totam.</p>
                                                <ul>
                                                    <li><a href=""><i className="fa fa-facebook fa-2x"></i></a></li>
                                                    <li><a href=""><i className="fa fa-twitter fa-2x"></i></a></li>
                                                    <li><a href=""><i className="fa fa-linkedin fa-2x"></i></a></li>
                                                </ul>
                                            </figcaption>
                                        </figure>

                                        <h4>Ananda Dwi Sugianto</h4>
                                        <p>2301895681</p>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="team-member">
                                        <figure>
                                            <img
                                                src="http://www.mauritiusdsilva.com/themes/hallooou/assets/images/terry-fletcher.jpg"
                                                alt="" className="img-responsive" />
                                            <figcaption>
                                                <p>Temporibus dolor, quisquam consectetur molestias, veniam voluptatum.
                                                    Beatae alias omnis totam.</p>
                                                <ul>
                                                    <li><a href=""><i className="fa fa-facebook fa-2x"></i></a></li>
                                                    <li><a href=""><i className="fa fa-twitter fa-2x"></i></a></li>
                                                    <li><a href=""><i className="fa fa-linkedin fa-2x"></i></a></li>
                                                </ul>
                                            </figcaption>
                                        </figure>
                                        <h4>Syaddad Aulia Rachman</h4>
                                        <p>23101956903</p>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
export default Tentang;