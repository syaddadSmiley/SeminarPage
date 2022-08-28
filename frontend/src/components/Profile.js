import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from './Navigation';
import { useNavigate } from 'react-router-dom'
import CInputImage from "./CInputImage";
import Modal from "./Modal"
import Footer from './Footer'
import GetCookie from "../hooks/GetCookies";
import jwt_decode from "jwt-decode";

const Profile = () => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false)
    const [modal, setModal] = useState({ isShow: false, message: '', onHide: () => { } })
    const [isEditMode, setIsEditMode] = useState(false)
    const [base64Image, setBase64Image] = useState(null)
    const auth = localStorage.getItem("TOKEN");
    const navigate = useNavigate();
    const token = GetCookie("token");
    const claims = jwt_decode(token)
    const idUser = claims.id
    const loadDetail = async () => {
        setLoading(true);
        try {
            const url = "http://localhost:8008/MyProfile";
            const { data } = await axios.get(url, { withCredentials: true, });

            setDetail(data.data);
            console.log("WDWDWDWDDW")
            console.log("profile user : ", data.data);
            console.log("GAMBAR", detail?.gambar)
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const deleteUser = async () => {
        setLoading(true);
        try {
            const url = "http://localhost:8008/DeleteUser/" + idUser;
            await axios.delete(url, { withCredentials: true, });
            localStorage.removeItem("user-info");
            navigate('/home');

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const handleOnChange = (type) => (e) => {
        e.preventDefault()
        setDetail(prevState => {
            return {
                ...prevState,
                [type]: e.target.value
            }
        })
    }

    const handleUpdateStudent = async () => {
        setIsUpdating(true);
        const payload = {
            nama: detail?.nama,
            username: detail?.username,
            no_hp: detail?.no_hp,
            gambar: base64Image || detail?.gambar
        }
        
        console.log('PAYLOAD REQUEST', payload)
       
        try {
            const url = `http://localhost:8008/UpdateUser/${detail?.id}`;
            const res = await axios.put(url, payload, { withCredentials: true, });
            if (res.data.data.message == "Update Success") throw new Error(res.data.message)
            localStorage.setItem("user-info", JSON.stringify(res.data.data))
            console.log(payload.gambar)
        
            setModal({
                isShow: true,
                message: res.data.message,
                onHide: () => { navigate("/home") }
            })

        } catch (error) {
            console.log(error.response)
            console.log(error.response.data.message);
            setModal({
                isShow: true,
                message: "Failed Update, ERROR : " + error.response.data.message,
                onHide: () => { setModal(prev => ({ ...prev, isShow: false })) }
            })
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        loadDetail();
    }, []);

    const buttonClass = isUpdating ? "btn btn-primary m-3 disabled" : "btn btn-primary m-3"

    return (

        <div className="card-guru-detail" >
            <Navbar />

            {!loading ? (
                <div className="col-md-6 mx-auto my-5">
                    <h3 className="mt-5 mb-3">My Profile</h3>
                    <div className="card" aria-label="Post Card" style={{}}>
                        <img src={detail?.gambar} className="card-image-top" style={{ maxHeight: '300px', maxWidth: '200px', marginRight: 'auto', marginLeft: 'auto', display: 'block' }} />
                    </div>
                    {/* <img src={detail?.profile_pict} /> */}
                    <CInputImage value={detail?.profile_pict} onFileChange={(value) => setBase64Image(value)} isShowUploadButton={isEditMode} resetDefaultState={!isEditMode} />
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Nama</th>
                                <td>{isEditMode ? <CInputForm onChange={handleOnChange('nama')} value={detail?.nama} /> : detail?.nama}</td>
                            </tr>
                            <tr>
                                <th>Username</th>
                                <td>{isEditMode ? <CInputForm onChange={handleOnChange('username')} value={detail?.username} /> : detail?.username}</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>{isEditMode ? <CInputForm disabled onChange={handleOnChange('mail')} value={detail?.mail} /> : detail?.mail}</td>
                            </tr>
                        </tbody>
                    </table>
                    {
                        isEditMode &&
                        <button className={buttonClass} onClick={handleUpdateStudent}>{isUpdating ? "Updating Profile..." : "Save Changes"}</button>
                    }
                    <button className={buttonClass} onClick={() => setIsEditMode(isEdit => !isEdit)}>{isEditMode ? "Cancel" : "Update"}</button>
                    <button className={buttonClass} onClick={() => deleteUser()}>Delete</button>
                </div>
            ) : (
                <h2>Loading...</h2>
            )
            }
            <Modal
                show={modal.isShow}
                onHide={modal.onHide}
                message={modal.message}
            />
            <Footer />

        </div >

    );
};

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

const CInputForm = ({ onChange, value, disabled }) => {
    return (
        <div>
            <input
                type="text"
                className="form-control"
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
            {!value ? <span className="warning">Field harus diisi</span> : ""}
        </div>
    )
}

export default Profile;
