import React, { useState, useEffect } from "react"
import axios from 'axios';
import { Link } from "react-router-dom";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../style/Home.css';
import '../App.css';
import Products from "./Products";
import Navbar from './Navigation';
import BannerSection from "./BannerSection";
import HomeAnimation from "../images/Kids-Studying-from-Home.gif"
import Footer from "./Footer"
import ListProduct from "./ListProduct";

function Home() {

    const auth = JSON.parse(localStorage.getItem("user-info"));
    const [cardGuru, setCardGuru] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getCardGuruData = async () => {
        try {
            const SW_API_URL = `http://localhost:8008/GetBarang?search=`
            const list = await axios.get(SW_API_URL, {
                withCredentials: true,});
            setCardGuru(list.data.data)
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        getCardGuruData();
    }, []);

    return (

        <div className='bg-white col-md-12 min-vh-100'>
            <Navbar />

            <div className="container mt-5">
                <div className="d-flex justify-content-around">
                    <div className="col-md-5">
                        <img src={HomeAnimation} alt="kids-studying-animation" className="animated-gif" />

                    </div>

                    <div className="caption col-md-18">
                        <h3>SIPALING RAJIN</h3>
                        <p>Wadah untuk mencari seminar dikala kamu membutuhkannya,membantumu berubah dan berkembang jadi lebih baik karena rahasia untuk maju adalah memulainya</p>
                        <div className="d-flex flex-wrap col-md-12 pt-5">
                            <div className="col-md-4 col-sm-6 col-12">
                                <div className="card card-fitur">
                                    <p>"Jika tidak ada perjuangan, tidak ada kemajuan."</p>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-12">
                                <div className="card card-fitur">
                                    <p>"Pemenang tidak pernah takut, penakut tidak pernah menang."</p>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-12">
                                <div className="card card-fitur">
                                    <p>"Memperbaiki diri kita adalah memperbaiki dunia."</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {!auth ? <BannerSection /> : <p></p>}
            {auth ? <ListProduct /> : <p></p>}
            
            <Footer />
        </div >
    );
}

export default Home;