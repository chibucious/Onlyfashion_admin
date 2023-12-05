    import React, { useEffect } from 'react'
    import { fetchData } from '../../api/apiService';
    import { toast } from 'react-toastify';
    import Cookies from 'js-cookie';
    import { adminTypeMap } from '../../utilities/reusablefunctions_variables';
    import { Link, useNavigate } from 'react-router-dom';
import { setupCommonFunctionality } from '../../utilities/headandsidebar';


    const Header = () => {
        const navigate = useNavigate();

        const authToken = Cookies.get('userAuthFashionBlogModerator');
        const endpoint_fetchauthadmin = '/user/authprofile';

        const allowheaders = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }

        useEffect(() => {
            setupCommonFunctionality();
            fetchAdminAsync();
          }, []);

          
        
          function addEventListeners() {
            document.addEventListener('DOMContentLoaded', () => {
              
        
              document.querySelector('.more-option').addEventListener('click', function () {
                document.querySelector('.more-optn').classList.toggle('show');
              });
        
             
            });
          }
    
          function handleNavIcon3Click() {
            this.classList.toggle('open');
          }
        
          function handleMoreOptionClick() {
            document.querySelector('.more-optn').classList.toggle('show');
          }
        
        
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
                    },1000);
                }else{
                    let user = result.data;
                    document.querySelector('#role').innerHTML = adminTypeMap[user.role];
                    document.querySelector('#username').innerHTML = user.username;
                    document.querySelector('#email').innerHTML = user.email;
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
        
        const logout =()=>{
            // $.ajax({
            //   type: 'POST',
            //   url: uRL+'admin/logout',
            //   data: {},
            //   dataType:'json',
            //   beforeSend: function(xhr){
            //     xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            //     // toast.warning("Logging you out!!!");
            //   },
            //   success: function(response){
            //     // console.log(response);
            //     toast.success(response.message);
            //     localStorage.clear();
            //     clearCookies();
            //     setTimeout(()=>{
            //       // navigate('/login');
            //       window.location.replace('/login');
            //     },2000)
            //   },
            //   error: function (xhr, textStatus, errorThrown) {
            //     if (xhr.responseJSON) {
            //       if(Array.isArray(xhr.responseJSON.message)){
            //         toast.error(xhr.responseJSON.message[0]);
            //         return;
            //       }
            //       toast.error(xhr.responseJSON.message);
            //       // console.error('Error message:', xhr.responseJSON.message);
            //       // console.error('Error status:', xhr.responseJSON.status);
            //     }
            //     localStorage.clear();
            //     clearCookies();
            //     setTimeout(()=>{
            //       // navigate('/login');
            //       window.location.replace('/login');
            //     },2000)
            //   }
            // });
            // localStorage.clear();
            // clearCookies();
            // window.location.replace('/login');
        }


        return (
            <div className="topbar">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="logo d-flex align-items-center">
                                <h5 className='fw-bold' style={{fontSize:'22px',color:'black'}}>Onlyfashion</h5> &nbsp;&nbsp;
                                <Link to="/dashboard" title=""><img src="../assets/images/onlyfashionlogo2.png" alt="" width={37} height={3} /></Link>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <ul className="notify-area">
                                <li>
                                    <div className="nav-icon3"> <span></span> <span></span> <span></span> <span></span> </div>
                                    <i className="fa fa-navicon nav-icon3"></i>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-1">
                            <div className="user-head">
                                <div className="admin">
                                    <div className="admin-avatar"><img src="../assets/images/resources/admin.png" alt="Bimg" /> <i className="online"></i> </div>
                                </div>
                                <div className="drop setting text-capitalize"> 
                                    <span className="drop-head fw-bold" id='role'>Loading...</span>
                                    <span className="drop-head" id='username' style={{fontSize:'14px'}}></span>
                                    <i><span className="drop-head text-lowercase text-primary pt-0" style={{fontSize:'14px',marginTop:'-6px'}} id='email'></span></i>
                                    <ul className="drop-meta">
                                        <li> <Link to="/settings" title=""><i className="fa fa-eyedropper"></i>Edit Profile</Link> </li>
                                    </ul>
                                    <span className="drop-bottom mt-3"><Link to="/logout" title=""><i className="fa fa-sign-out"></i>log Out</Link></span> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    export default Header