import React, { useEffect } from 'react';
import {} from "../pages/notfound.css";
import logo from '../assets/images/favicon.png';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

  useEffect(()=>{
    document.querySelector('.cont_principal').className= "cont_principal cont_error_active";  
  })

  const navigate = useNavigate();

  const goBack =()=>{
   navigate('/login');
  }

  return (
    <div className="cont_principal">
        {/* begin::Logo */}
        <div className="d-flex justify-content-center logo-container">
            <img style={{width: '200px'}} src={logo} alt='Logo' />
        </div>     
        {/* end::Logo */}

        <div className="cont_error">
            <h1>Oops</h1>  
            <p>The Page you're looking for isn't here.</p>
            <button className='btn btn-round g-blue-bg text-white' onClick={goBack}>Continue with Blog</button>
        </div>

        <div className="cont_aura_1"></div>
        <div className="cont_aura_2"></div>
    </div>
  )
}

export default NotFound