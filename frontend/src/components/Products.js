import React, { useState } from "react"
import '../style/Products.css'
import '../hooks/ForProducts'

export default function Products({ judul, jenisProduct, deskripsi, lokasi, harga, image}) {

    return (

        <div class="card ">
            <div class="card__image-holder">
                <img class="card__image" src={image} alt="desert" style={{maxWidth:'260px', maxHeight:'260px'}}/>
            </div>
            <div class="card-title">
                <a href="#" class="toggle-info btn">
                    <span class="left"></span>
                    <span class="right"></span>
                </a>
                <h2>
                    {judul.length > 20 ? <p style={{fontSize: '21px', marginBottom: '0px'}}>{judul}</p> : judul}
                    <small>{jenisProduct} | {lokasi}</small>
                </h2>
            </div>
            {/* <div class="card-flap flap1 show">
                <div class="card-description">
                    {deskripsi}
                </div>
                <div class="card-flap flap2">
                    <div class="card-actions">
                        <a href="#" class="btn">Read more</a>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
