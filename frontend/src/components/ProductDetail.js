import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from './Navigation';
import Footer from './Footer'
import '../style/ProductDetail.css';
import jwt_decode from "jwt-decode";
import GetCookie from "../hooks/GetCookies";
import Modal from "./Modal";


const ProductDetail = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [detail, setDetail] = useState(null);
    const [wishlist, setWishlist] = useState(null);
    const [wishlistStatus, setWishlistStatus] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = React.useState("");
    const { id } = useParams();
    console.log("id", id)
    const auth = GetCookie("token");
    const claims = jwt_decode(auth);
    const [data, setData] = useState({
        id_user: "",
        id_product: "",
    });
    // let result = await fetch('http://localhost:8008/Register', {
    //     method: 'POST',
    //     body: JSON.stringify(item),
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json"
    //     }
    // });
    // result = await result.json();
    const AddWishlist = () => {
        axios.post("http://localhost:8008/Wishlist/add",{
            id_user: claims.id,
            id_product: id
        }, {withCredentials: true})
            .then(res => {
                console.log("res", res)
                setWishlistStatus(true);
                console.log(wishlistStatus)
                setWishlist(res.data.data)
                setModalMessage("Wishlist Succesfully Added");
                setModalShow(true)
            }).catch(err => {
                console.log("err", err)
                setModalMessage("Code Error : " + err.code + " | " + err.message);
                setModalShow(true)
            }).finally(() => {
                setLoading(false)
                // window.location.reload();
            }
            )
    }

    const DeleteWishlist = () => {
        axios.delete("http://localhost:8008/Wishlist/hapus?id="+wishlist.id,{
            withCredentials: true})
            .then(res => {
                console.log("res", res)
                setWishlistStatus(false);
                console.log(wishlistStatus)
                setModalMessage("Wishlist Succesfully Deleted");
                setModalShow(true)
            }).catch(err => {
                console.log("err", err)
                setModalMessage("Code Error : " + err.code + " | " + err.message);
                setModalShow(true)
            }).finally(() => {
                setLoading(false)
            }
            )
    }

    const loadDetail = async () => {
        setLoading(true);
        try {
            const url = "http://localhost:8008/api/GetBarang/" + id;
            console.log(url)
            const { data } = await axios.get(url, { withCredentials: true, });
            setDetail(data.data[0]);
            console.log(data.data[0])
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const loadDetail2 = async () => {
        setLoading(true);
        // const payload = {
        //     id_product: id,
        //     id_user: claims.id
        // }
        try {
            const url = "http://localhost:8008/Wishlist/get?id_product=" + id + "&id_user=" + claims.id;
            const { data } = await axios.get(url, {withCredentials: true, } );

            setWishlist(data.data[0]);
            if (data.data[0].status) {
                setWishlistStatus(true);
            }
            console.log("wishlist", data.data[0])
            console.log(data.data[0])
            // alert(wishlist)
            console.log(wishlistStatus)
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };


    useEffect(() => {
        loadDetail();
        loadDetail2();
    }, []);

    return (

        <div className="card-guru-detail" >
            <Navbar />

            {!loading ? (
                <div class="wrapper">
                    <div class="product-single">
                        <div class="product-gallery">
                            {/* <div class="slider-arrows"><i class="fa fa-fw fa-arrow-circle-o-left" id="prev-slide"></i><i class="fa fa-fw fa-arrow-circle-o-right" id="next-slide"></i></div> */}
                            <div id="slider-wrap" style={{background: '#ffff'}}>
                                <ul class="slides">
                                    <li><img src={detail?.gambar} alt="" style={{ maxWidth: '380px', maxHeight: '380px'}}/></li>
                                   
                                </ul>
                                {/* <ul class="nav-dots">
                                    <li class="active"></li>
                                    <li></li>
                                </ul> */}
                            </div>
                        </div>
                        <div class="product-details">
                            <h1 class="product-title">{detail?.judul}</h1>
                            <h3 class="product-cost">Rp. {detail?.harga},-</h3>
                            {/* <div class="product-rating">
                                <ul>
                                    <li class="fa fa-fw fa-lg fa-star"></li>
                                    <li class="fa fa-fw fa-lg fa-star"></li>
                                    <li class="fa fa-fw fa-lg fa-star"></li>
                                    <li class="fa fa-fw fa-lg fa-star"></li>
                                    <li class="fa fa-fw fa-lg fa-star-half"></li>
                                </ul><span class="product-reviews"><a href="#">10 Reviews</a></span>
                            </div> */}
                            <div class="product-description">
                                <p>{detail?.deskripsi}</p>
                            </div>
                            <div class="product-cta">
                                <button class="product-atc">Add to Cart</button>
                                {!wishlistStatus ? 
                                    <button class="product-atw" onClick={AddWishlist}>Add to Wishlist</button>
                                    : 
                                    <button class="product-atw" onClick={DeleteWishlist}>Delete Wishlist</button>
                                }
                                
                            </div>
                            <div class="product-info"><span class="product-sku">ID {detail?.id}</span></div>
                        </div>
                    </div>
                </div>

            ) : (
                <h2>Loading...</h2>
            )
            }
            <Footer />
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                message={modalMessage}
            />
        </div >

    );
};

export default ProductDetail;
