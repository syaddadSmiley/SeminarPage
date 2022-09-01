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
                <p>Sipaling-rajin merupakan sebuah website seminar yang dibuat oleh ananda dwi dan syaddad auliarachman yang bertujuan untuk memenuhi kegiatan akhir di semester 6</p>
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
                                                src="https://i.pinimg.com/originals/ca/e9/bf/cae9bfb535e2ca3d2771782c866af7df.png"
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
                                                src="https://upload.wikimedia.org/wikipedia/en/0/00/Professor_Charles_%27X%27_Xavier.png"
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