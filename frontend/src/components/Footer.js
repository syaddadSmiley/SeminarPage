import "../style/Footer.css"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import useStore from "../store/user";

export default function BannerSection() {
    const { name } = useStore()
    return (
        <div className="footer-dark">
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-md-3 item">
                            <h3>Services</h3>
                            <ul>
                                <li><a href="/home">Home</a></li>
                                <li><a href="/tentang">Tentang</a></li>
                                <li><a href="/profile">Profile {name}</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-md-3 item">
                            <h3>Tentang</h3>
                            <ul>
                                <li><a href="#">Company</a></li>
                                <li><a href="#">Team</a></li>
                                <li><a href="#">Careers</a></li>
                            </ul>
                        </div>
                        <div className="col-md-6 item text">
                            <h3>Sipaling-Rajin</h3>
                            <p>Tempat untuk mencari seminar</p>
                        </div>
                        <div className="col item social">
                            <a href="#"><i className="icon"><FaFacebook /></i></a>
                            <a href="https://twitter.com/chaeyoungallery"><i className="icon"><FaTwitter /></i></a>
                            <a href="https://www.instagram.com/lalalalisa_m/"><i className="icon"><FaInstagram /></i></a></div>
                    </div>
                    <p className="copyright">Ananda | Syaddad © 2023</p>
                </div>
            </footer>
        </div>

    )
}