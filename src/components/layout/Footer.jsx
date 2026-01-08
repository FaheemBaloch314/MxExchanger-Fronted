import React from 'react'
import { BsTwitterX } from 'react-icons/bs'
import { FaFacebook } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa6'
import '../../styles/footer.scss'
import { Link } from 'react-router-dom'

const Footer = () => {
    return <footer className='footer'>
        <div className="copyright">
            <Link to={'/'}>MxExchaner.com</Link>
            <h4> &copy; 2025 MxExchanger All Rights Are Reserved.</h4>
        </div>
        <div className="socialMedia">
            <h3>Follow Us</h3>
            <a href="http://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="http://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook/></a>  
            <a href="http://x.com" target="_blank" rel="noopener noreferrer"><BsTwitterX/></a>  
        </div>
    </footer>
}

export default Footer