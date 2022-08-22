import React from "react";
import "./AdminPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import GetCookie from "../../../hooks/GetCookies";
import jwt_decode from "jwt-decode";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import CInputImage from "../../CInputImage";
import ConvertTime from "../../../hooks/ConvertTime";

Modal.setAppElement("#root");

function AdminPage() {
  const [isEditMode, setIsEditMode] = useState(true)
  const [base64Image, setBase64Image] = useState(null)
  // const param = useParams();
  // console.log(param);
  const [toggleState, setToggleState] = useState(1);
  const [articles2, setArticles2] = useState([]);
  const [articles, setArticles] = useState([]);
  const [mopen, setMopen] = useState(false);
  let navigate = useNavigate();
  const [data, setData] = useState({
    id_jenis: "",
    gambar: "",
    judul: "",
    deskripsi: "",
    harga: 0,
    waktu: 0,
    kapasitas: 0,
    lokasi: "",
  });

  const checkTokenAdmin = GetCookie("token");
  const checkRole = jwt_decode(checkTokenAdmin);

  useEffect(() => {
    if (checkRole.Role !== "admin") {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    if (!checkTokenAdmin) {
      navigate("/");
    }
  }, []);

  // input data
  const submit = async (e) => {
    e.preventDefault();
    console.log("DATA", data)
    axios
      .post(
        "http://localhost:8008/AddProduct",
        {
          id_jenis: parseInt(data.id_jenis),
          gambar: base64Image,
          judul: data.judul,
          deskripsi: data.deskripsi,
          lokasi: data.lokasi,
          harga: parseInt(data.harga),
          waktu: data.waktu,
          kapasitas: parseInt(data.kapasitas),
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        alert("Data berhasil ditambahkan");
        window.location.reload();
      })
      .catch((err) => {
        const ErrorMessage = err.response.data;
        console.log(err.response.data);
        alert(err.response);
        console.log(err);
      })
      .finally(() => {
        setData({
          jenis: "",
        });
      })
      .finally(() => {
        // window.location.reload();
      });
  };

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    console.log(newData)
    console.log(ConvertTime(newData.waktu))
    setData(newData);
    // console.log(newData);
  }

  // get data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const resGet = await axios.get("http://localhost:8008/GetBarang", {
          withCredentials: true,
        });
        setArticles(resGet.data.data);
        console.log(resGet.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticle();
  }, []);

  useEffect(() => {
    const fetchArticle2 = async () => {
      try {
        const resGet2 = await axios.get("http://localhost:8008/GetCategory", {
          withCredentials: true,
        });
        setArticles2(resGet2.data.data);
        console.log(resGet2.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticle2();
  }, []);

  // edit data
  const handleUpdate = (id) => {
    const updateData = articles.find((item) => item.id === id);
    setData(updateData);
    setMopen(true);
  };

  const updateModal = async (e) => {
    e.preventDefault();
    if (data.id_jenis === "") {
      setData.id_jenis = 1;
    }
    console.log(data)
    axios
      .put(
        "http://localhost:8008/EditProduct",
        { 
          id: data.id,
          id_jenis: parseInt(data.id_jenis),
          gambar: base64Image,
          judul: data.judul,
          deskripsi: data.deskripsi,
          lokasi: data.lokasi,
          harga: parseInt(data.harga),
          waktu: data.waktu,
          kapasitas: parseInt(data.kapasitas),
        },
        { withCredentials: true }
      )
      .then((res) => {
        alert("Data berhasil diubah");
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert(JSON.stringify(err.response.data));
      });
    setMopen(false);
    window.location.reload();
  };

  // delete data
  const handleDelete = (id) => {
    const newDataDelete = articles.filter((item) => item.id !== id);
    setArticles(newDataDelete);
    const text = "Apakah anda yakin ingin menghapus data ini?";
    if (window.confirm(text) === true) {
      axios
        .delete(`http://localhost:8008/DeleteProduct?id=${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      alert("Data berhasil dihapus");
    }else{
      alert("Penghapusan Data Dibatalkan");
      window.location.reload();
    }
    
  };

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <>
      <Modal
        isOpen={mopen}
        onRequestClose={() => setMopen(false)}
        style={{
          overlay: {
            backgroun: "transparent !important",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "50%",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "60",
          },
        }}
      >
        <h1 className="text-center">Edit</h1>
        <div className="row"></div>
        <div className="col"></div>
        <form onSubmit={updateModal}>
          {/* <div className="card" aria-label="Post Card" style={{ marginTop: '15px', }}>
            <img src={data.gambar} className="card-image-top" style={{ maxHeight: '300px', maxWidth: '200px' }} />
          </div> */}
          <CInputImage value={data?.gambar} onFileChange={(value) => setBase64Image(value)} isShowUploadButton={isEditMode} resetDefaultState={isEditMode} style={{ maxHeight: '300px', maxWidth: '200px' }} />

          {/* <div className="mb-2"></div>
          <label htmlFor="inputJudul3" className="col-sm-3 col-form-label">
            Category
          </label>
          <input
            type="text"
            class="form-control"
            id="jenisProducts"
            name="JenisProducts"
            value={data.jenisProducts}
            onChange={(e) => handle(e)}
          ></input> */}

          <div className="mb-2"></div>
          <label htmlFor="inputPenulis3" className="col-sm-3 col-form-label">
            Category
          </label>
          <select
            type="number"
            className="form-control"
            name="id_jenis"
            id="id_jenis"
            onChange={(e) => handle(e)}
          >
            <option value="">Pilih Category</option>
            {articles2.map((article2, index) => (
              <option key={index} value={setData.id_jenis} placeholder={article2.jenis}>
                {article2.id}
              </option>
            )
            )}
          </select>

          <div className="mb-2"></div>
          <label htmlFor="inputDeskripsi3" className="col-sm-3 col-form-label">
            Judul
          </label>
          <input
            type="text"
            class="form-control"
            id="judul"
            name="judul"
            value={data.judul}
            placeholder={data.judul}
            onChange={(e) => handle(e)}
          ></input>

          <div className="mb-2"></div>
          <label htmlFor="inputDeskripsi3" className="col-sm-3 col-form-label">
            Deskripsi
          </label>
          <input
            type="text"
            class="form-control"
            id="deskripsi"
            name="deskripsi"
            value={data.deskripsi}
            placeholder={data.deskripsi}
            onChange={(e) => handle(e)}
          ></input>

          <div className="mb-2"></div>
          <label htmlFor="inputDeskripsi3" className="col-sm-3 col-form-label">
            Lokasi
          </label>
          <input
            type="text"
            class="form-control"
            id="lokasi"
            name="lokasi"
            value={data.lokasi}
            placeholder={data.lokasi}
            onChange={(e) => handle(e)}
          ></input>

          <div className="mb-2"></div>
          <label htmlFor="inputDeskripsi3" className="col-sm-3 col-form-label">
            Kapasitas
          </label>
          <input
            type="number"
            class="form-control"
            id="kapasitas"
            name="kapasitas"
            value={data.kapasitas}
            placeholder={data.kapasitas}
            onChange={(e) => handle(e)}
          ></input>

          <div className="mb-2"></div>
          <label htmlFor="inputPenulis3" className="col-sm-3 col-form-label">
            Waktu
          </label>
          <input
            type="datetime-local"
            class="form-control"
            id="waktu"
            name="waktu"
            value={data.waktu}
            placeholder={data.waktu}
            onChange={(e) => handle(e)}
          ></input>

          <div className="mb-2"></div>
          <label htmlFor="inputDeskripsi3" className="col-sm-3 col-form-label">
            Harga
          </label>
          <input
            type="number"
            class="form-control"
            id="harga"
            name="harga"
            value={data.harga}
            placeholder={data.harga}
            onChange={(e) => handle(e)}
          ></input>

          

          <div className="col-sm-3">
            <input
              type="submit"
              className="btn btn-success-custom"
              name="update"
              value="Update"
            />
          </div>

          <div className="mb-3">
            <input
              type="submit"
              className="btn btn-secondary"
              name="batal"
              value="Batal"
            />
          </div>
        </form>
      </Modal>

      <div className="container">
        <div className="bloc-tabs">
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          >
            Data Table
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            Input Data
          </button>
        </div>

        <div className="content-tabs">
          <div
            className={
              toggleState === 1 ? "content  active-content" : "content"
            }
          >
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Jenis</th>
                  <th scope="col">Judul</th>
                  <th scope="col">Deskripsi</th>
                  <th scope="col">Lokasi</th>
                  <th scope="col">Harga</th>
                  <th scope="col">Waktu</th>
                  <th scope="col">Kapasitas</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) =>
                  article.deskripsi.length > 25 ? (
                    <tr key={index}>
                      <th scope="row">{article.jenisProducts}</th>
                      <td>{article.judul}</td>
                      <td>{article.deskripsi.substring(0, 25)}...</td>
                      <td>{article.lokasi}</td>
                      <td>{article.harga}</td>
                      <td>{ConvertTime(article.waktu)}</td>
                      <td>{article.kapasitas}</td>
                      {/* <td>{article.deskripsi}</td> */}
                      {/* <td>{article.deskripsi.substring(0, 15)}...</td> */}
                      <td>
                        <button
                          type="button"
                          className="btn btn-warning me-2"
                          // onClick={() => setMopen(true)}
                          onClick={() => handleUpdate(article.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(article.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <th scope="row">{article.jenisProducts}</th>
                        <td>{article.judul}</td>
                        <td>{article.deskripsi}</td>
                        <td>{article.lokasi}</td>
                        <td>{article.harga}</td>
                        <td>{ConvertTime(article.waktu)}</td>
                        <td>{article.kapasitas}</td>
                      {/* <td>{article.deskripsi.substring(0, 20)}...</td> */}
                      <td>
                        <button
                          type="button"
                          className="btn btn-warning me-2"
                          // onClick={() => setMopen(true)}
                          onClick={() => handleUpdate(article.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(article.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div
            className={
              toggleState === 2 ? "content  active-content" : "content"
            }
          >
            <form onSubmit={submit}>
              <div className="card" aria-label="Post Card" style={{marginTop: '15px',}}>
                <img src={data.gambar} className="card-image-top" style={{ maxHeight: '300px', maxWidth: '200px' }} />
              </div>
              <CInputImage value={data?.gambar} onFileChange={(value) => setBase64Image(value)} isShowUploadButton={isEditMode} resetDefaultState={isEditMode} style={{ maxHeight: '300px', maxWidth: '200px' }} />
              {/* <img src={detail?.profile_pict} /> */}
            
              <div className="mb-3">

              <label className="form-label">Category</label>
              <select
                type="text"
                className="form-control"
                name="id_jenis"
                id="id_jenis"
                onChange={(e) => handle(e)}
              > 
                <option value="">Pilih Category</option>
                {articles2.map((article2, index) => (
                  <option key={index} value={setData.id_jenis}>
                    {article2.id}
                  </option>
                )
                )}
              </select>

              <label className="form-label">Judul</label>
              <input
                type="text"
                value={data.judul}
                className="form-control"
                name="judul"
                id="judul"
                onChange={(e) => handle(e)}
              ></input>

              <label className="form-label">Deskripsi</label>
              <textarea
                type="text-area"
                value={data.deskripsi}
                className="form-control"
                name="deskripsi"
                id="deskripsi"
                onChange={(e) => handle(e)}
              ></textarea>

              <label className="form-label">Lokasi</label>
              <input
                type="text"
                value={data.lokasi}
                className="form-control"
                name="lokasi"
                id="lokasi"
                onChange={(e) => handle(e)}
              ></input>

                <label className="form-label">Kapasitas</label>
                <input
                  type="number"
                  value={data.kapasitas}
                  className="form-control"
                  name="kapasitas"
                  id="kapasitas"
                  onChange={(e) => handle(e)}
                ></input>

              <label className="form-label">Waktu</label>
              <input
                type="datetime-local"
                value={data.waktu}
                className="form-control"
                name="waktu"
                id="waktu"
                placeholder="DD/MM/YYYY/HH:MM"
                onChange={(e) => handle(e)}
              ></input>

              <label className="form-label">Harga</label>
              <input
                type="number"
                value={data.harga}
                className="form-control currency"
                name="harga"
                id="harga"
                onChange={(e) => handle(e)}
              ></input>
              
            </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
