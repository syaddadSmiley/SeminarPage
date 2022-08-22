import React from "react";
import "./AdminPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import GetCookie from "../../../hooks/GetCookies";
import jwt_decode from "jwt-decode";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

function AdminPage() {
  // const param = useParams();
  // console.log(param);
  const [toggleState, setToggleState] = useState(1);
  const [articles, setArticles] = useState([]);
  const [mopen, setMopen] = useState(false);
  let navigate = useNavigate();
  const [data, setData] = useState({
    id: "",
    jenis: "",
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

    axios
      .post(
        "http://localhost:8008/AddCategory",
        {
          jenis: data.jenis,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        alert("Data berhasil ditambahkan");
        window.location.reload();
      })
      .catch((err) => {
        const ErrorMessage = err.response.data.message;
        console.log(err.response.data.message);
        alert(ErrorMessage);
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
    setData(newData);
    // console.log(newData);
  }

  // get data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const resGet = await axios.get("http://localhost:8008/GetCategory", {
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

  // edit data
  const handleUpdate = (id) => {
    const updateData = articles.find((item) => item.id === id);
    setData(updateData);
    setMopen(true);
  };

  const updateModal = async (e) => {
    e.preventDefault();

    axios
      .put(
        "http://localhost:8008/EditCategory",
        {
          id: data.id,
          jenis: data.jenis,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
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
        .delete(`http://localhost:8008/DeleteCategory?id=${id}`, {
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

          {/* <div className="mb-2"></div>
          <label htmlFor="inputPenulis3" className="col-sm-3 col-form-label">
            Penulis
          </label>
          <input
            type="text"
            class="form-control"
            id="Id_Penulis"
            name="Id_Penulis"
            value={setData.Id_Penulis}
            placeholder="penulis"
            onChange={(e) => handle(e)}
          ></input> */}

          <div className="mb-2"></div>
          <label htmlFor="inputJudul3" className="col-sm-3 col-form-label">
            Category Name
          </label>
          <input
            type="text"
            class="form-control"
            id="jenis"
            name="Jenis"
            value={data.jenis}
            onChange={(e) => handle(e)}
          ></input>

          {/* <div className="mb-2"></div>
          <label htmlFor="inputPenulis3" className="col-sm-3 col-form-label">
            Tanggal
          </label>
          <input
            type="date"
            class="form-control"
            id="Tanggal"
            name="Tanggal"
            value={setData.Tanggal}
            onChange={(e) => handle(e)}
          ></input> */}

          {/* <div className="mb-2"></div>
          <label htmlFor="inputDeskripsi3" className="col-sm-3 col-form-label">
            Deskripsi
          </label>
          <input
            type="text"
            class="form-control"
            id="Deskripsi"
            name="Deskripsi"
            value={setData.Deskripsi}
            placeholder="deskripsi"
            onChange={(e) => handle(e)}
          ></input> */}

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
                  <th scope="col">Id</th>
                  <th scope="col">Judul</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) =>
                  article.jenis.length > 15 ? (
                    <tr key={index}>
                      <th scope="row">{article.id}</th>
                      <td>{article.jenis}</td>
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
                      <th scope="row">{article.id}</th>
                      <td>{article.jenis}</td>
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
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  value={data.jenis}
                  className="form-control"
                  name="jenis"
                  id="jenis"
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
