
export default function BannerSection() {

    return (
        <div className="jumbotron jumbotron-fluid my-5 py-5">
            <div className="container py-5 d-flex justify-content-center">
                <div className="col-md-6 pd-5 m-3">
                    <h3>Ayoo daftarkan diri kalian</h3>
                    <p className="lead">Daftar untuk melihat seminar terbaru yang membuat diri kalian menjadi lebih baik lagi</p>

                </div>
                <div>
                    <button className="btn btn-primary mt-5" ><a href="/register">Daftar Sekarang</a></button>

                </div>
            </div>
        </div>

    )
}