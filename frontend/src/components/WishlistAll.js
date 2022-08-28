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
import '../style/Products.css'

export default function WishlistAll() {
    const auth = JSON.parse(localStorage.getItem("user-info"));
    const [cardGuru, setCardGuru] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getCardGuruData = async () => {
        try {
            const SW_API_URL = `http://localhost:8008/Wishlist/all/`+auth.id
            const list = await axios.get(SW_API_URL, {
                withCredentials: true,
            });
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
        <div className="container my-5 py-5">
            <h3>Your Wishlists</h3>

            <div className="d-flex justify-content-center my-5">
                <div className="col-md-5 mx-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Cari..."
                        onChange={(event) => {
                            setSearchTerm(event.target.value)
                        }}
                    />
                </div>
                <button type="button" className="btn btn-primary">
                    Cari
                </button>
            </div>
            <div className="d-flex flex-wrap col-md-12 wrap-teacher">
                {cardGuru.filter((item) => {
                    if (searchTerm == "") return item;
                    else if (item.deskripsi.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                        item.judul.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                        item.jenisProducts.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                        item.lokasi.toLowerCase().includes(searchTerm.toLocaleLowerCase())

                    ) {
                        return item
                    }
                }).map((item, index) => {
                    return <div className="cards" key={index}>
                        <Link to={`/teacher/${item.id}`}>
                            <Products
                                judul={item.judul}
                                deskripsi={item.deskripsi}
                                jenisProduct={item.jenisProducts}
                                lokasi={item.lokasi}
                                harga={item.harga}
                                image={item.gambar}
                            />
                        </Link>
                    </div>
                }
                )}
            </div>
        </div>
        </div>
    )
}