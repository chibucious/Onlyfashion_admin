import Cookies from 'js-cookie';
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchData } from '../../api/apiService';
import { toast } from 'react-toastify';
import { adminTypeMap } from '../../utilities/reusablefunctions_variables';

const ResponsiveHeader = () => {

    const navigate = useNavigate();

    const authToken = Cookies.get('userAuthFashionBlogModerator');
    const endpoint_fetchauthadmin = '/user/authprofile';

    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }

    useEffect(() => {
        fetchAdminAsync();
    }, []);
    
    const fetchAdminAsync = async () => {
        try {
            const result = await fetchData(endpoint_fetchauthadmin, allowheaders);
            if(result.error){
                toast.error(result.message);
            }
            console.log("User Profile ", result);
            if(result.error === true){
                setTimeout(()=>{
                    navigate('/logout');
                },1000)
            }else{
                let user = result.data;
                document.querySelector('#responsive_role').innerHTML = adminTypeMap[user.role];
                document.querySelector('#responsive_username').innerHTML = user.username;
                document.querySelector('#responsive_email').innerHTML = user.email;
            }
            
        } catch (error) {
            console.log('Error:', error);
        }
    };
    
    function clearCookies() {
        const cookies = document.cookie.split(';');
      
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    }

    return (
        <div className="responsive-header">
            <div className="logo-area">
                
            <div className='d-flex justify-content-between align-items-center'>
                        
                        <div className="flex-1">
                            <ul className="notify-area">
                                <li>
                                    {/* <div className="nav-icon3 "> <span></span> <span></span> <span></span> <span></span> </div> */}
                                    <i className="fa fa-navicon nav-icon3"></i>
                                </li>
                            </ul>
                        </div>
                        <div class="col-lg-2">
                            <div class="logo"><Link to="/dashboard" title=""><img src="../assets/images/onlyfashionlogo2.png" alt="" width={70} height={6} /></Link></div>
                        </div>
                        <div className="flex-1">
                            <div className="user-head">
                                <div className="admin">
                                    <div className="admin-avatar"><img src="../assets/images/resources/admin.png" alt="Bimg" /> <i className="online"></i> </div>
                                </div>
                                <div className="drop setting text-capitalize"> 
                                    <span className="drop-head fw-bold" id='responsive_role'>Loading...</span>
                                    <span className="drop-head" id='responsive_username' style={{fontSize:'14px'}}></span>
                                    <i><span className="drop-head text-lowercase text-primary pt-0" style={{fontSize:'14px',marginTop:'-6px'}} id='responsive_email'></span></i>
                                    <ul className="drop-meta">
                                        <li> <Link to="/settings" title=""><i className="fa fa-eyedropper"></i>Edit Profile</Link> </li>
                                    </ul>
                                    <span className="drop-bottom mt-3"><Link to="/logout" title=""><i className="fa fa-sign-out"></i>log Out</Link></span> </div>
                            </div>
                        </div>
                    </div>
            
            </div>
            {/* <div className="t-search">
            <form method="post">
                <input type="text" placeholder="Enter Your Keyword"/>
                <button type="submit"><i className="fa fa-search"></i></button>
            </form>
            </div> */}
        </div>
    )
}

export default ResponsiveHeader