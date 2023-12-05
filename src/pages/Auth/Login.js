import React, { useEffect, useState } from 'react'
import { postData } from '../../api/apiService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const Login = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevVisible => !prevVisible);
    };

    const endpoint_login = '/user/login';

    useEffect(() => {
        // Attach the event listener for form submission
        const adminLoginForm = document.getElementById('adminLogin');
        adminLoginForm.addEventListener('submit', handleAdminLoginSubmit);

        // Cleanup by removing the event listener when component is unmounted
        return () => {
            adminLoginForm.removeEventListener('submit', handleAdminLoginSubmit);
        };
    });


    async function handleAdminLoginSubmit(event) {
        event.preventDefault();
      
        const formData = new FormData(event.target);
        const data = {};
      
        formData.forEach((value, key) => {
          data[key] = value;
        });
      
        try {
          const result = await postData(endpoint_login, data);
          let response = JSON.parse(result);
          // console.log("POST request Successful:", response);
          toast.success(response.message);
          Cookies.set('userAuthFashionBlogModerator', response.token, { expires: 1 });
          window.location.replace('/dashboard');
        } catch (error) {
          // console.error('Failed to make POST request:', error.message);
          let response = JSON.parse(error.message);
          if(response.error === true){
            toast.error(response.message);
          }
        }
    }

    // const handleLoginManagement =() =>{

       
    // }


    return (
        <div className="admin-lock vh100">
            <div className="admin-form">
                <div className="logo"><img src="assets/images/logo2.png" width="220" alt="" /></div>
                <h4>Sign In Account</h4>
                <span>Please enter your user information</span>
                <form id='adminLogin'>
                    <label><i className="fa fa-envelope"></i></label>
                    <input type="text" placeholder="Username" 
                    name='username' required />
                    
                    <label><i className="fa fa-unlock-alt"></i></label>
                    <div className="pass-group position-relative">
                        <input type={passwordVisible ? 'text' : 'password'}  className="form-control pass-input"
                           name="password" required />
                        <span className={`fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} toggle-password` }
                            onClick={togglePasswordVisibility}
                        ></span>
                    </div>
                    
                    <label htmlFor="remember">
                        {/* Remember Me */} 
                        <a href="login.html#" title="">Forgot password?</a>
                    </label>
                    <button type="submit">sign in</button>
                </form>
                {/* <span>Don't have an account? <a href="login.html#" title="">Sign up</a></span>  */}
            </div>
        </div>
    )
}

export default Login