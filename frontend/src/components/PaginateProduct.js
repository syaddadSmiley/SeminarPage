import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import axios from 'axios';
import { Link } from "react-router-dom";
import SearchProduct from './SearchProduct';

function PaginateProduct() {
    const [cardData, setCardData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    let limit = 8;

    useEffect(()=>{
        
        const getCardGuruData = async () => {
            setLoading(true)
            try {
                const SW_API_URL = `http://localhost:8008/GetBarang/pagination?per_page=${limit}&page=1`
                const list = await fetch(SW_API_URL, {
                    credentials: 'include',
                });
                const data1 = await list.json();
                console.log(data1)
                // const total = data1.data.length;
                const arr1 = data1.data
                setPageCount(data1.pagination.total_page)
                // setPageCount(Math.ceil(total / limit));
                setLoading(false)
                setCardData(arr1)
                return arr1;
            } catch (error) {
                console.log('Error', error);
            }
            setLoading(false)
            
        };

        getCardGuruData();

    }, [limit])

    const fetchCardGuruData = async (currentPage) => {
        setLoading(true)
        try {
            const res = await fetch(
                `http://localhost:8008/GetBarang/pagination?per_page=${limit}&page=${currentPage}`, {
                    credentials: 'include'
                }
                // `https://jsonplaceholder.typicode.com/comments?_page=${currentPage}&_limit=${limit}`
            );
            const data2 = await res.json();
            console.log(data2.data)
            setLoading(false)
            return data2.data;
        } catch(error){
            setLoading(false)
            console.log("Error", error)
        }

    };

    const handlePageClick = async (data) => {
        setLoading(true)
        console.log(data.selected)

        let currentPage = data.selected + 1;

        const commentsFormServer = await fetchCardGuruData(currentPage);

        setCardData(commentsFormServer);
        setLoading(false)
    };

    const searchProduct = async (searchTerm) => {
        
    }
    
    return(
        <div className='container'>
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
                <Link to={`/product/search`}>
                <button onClick={SearchProduct(searchTerm)} type="button" className="btn btn-primary">
                    Cari
                </button>
                </Link>
            </div>
            
            {!loading ? (
                <div className="d-flex flex-wrap col-md-12 wrap-teacher">
                {cardData.filter((item) =>{
                    if (searchTerm == "") return item;
                    else if (item.deskripsi.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                        item.judul.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                        item.jenisProducts.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                        item.lokasi.toLowerCase().includes(searchTerm.toLocaleLowerCase())

                    ) {
                        return item
                    }
                }).map((item) => {
                    
                    return <div className="cards">
                     <div class="card ">
                        <Link to={`/product/${item.id}`}>
                        <div class="card__image-holder">
                            <img class="card__image" src={item.gambar} alt="desert" style={{ maxWidth: '260px', maxHeight: '260px' }} />
                        </div>
                        <div class="card-title">
                            <a href="#" class="toggle-info btn">
                                <span class="left"></span>
                                <span class="right"></span>
                            </a>
                            <h2>
                                {item.judul.length > 20 ? <p style={{ fontSize: '21px', marginBottom: '5px'}}>{item.judul}</p> : item.judul}
                                <small>{item.jenisProducts} | {item.lokasi}</small>
                                <h6>{item.id.substring(0, 7)}</h6>
                            </h2>
                        </div>
                        </Link>
                    </div>
                    </div>
                })}
                </div>
            ) : (
                <h2>Loading...</h2>
            )}
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={3}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </div>
    );
}

export default PaginateProduct;