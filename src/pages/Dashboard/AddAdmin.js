import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { postData } from '../../api/apiService'
import ResponsiveHeader from '../../components/Header/ResponsiveHeader'

const AddAdmin = () => {

    const navigate = useNavigate();

    const endpoint_add = '/user/register';

    const authToken = Cookies.get('userAuthFashionBlogModerator');

    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }

    useEffect(() => {
        // Attach the event listener for form submission
        const add = document.getElementById('addAdmin');
        
        add.addEventListener('submit', handleAddAdmin);

        // Cleanup by removing the event listener when component is unmounted
        return () => {
            add.removeEventListener('submit', handleAddAdmin);
        };
    }, []);

    async function handleAddAdmin(event) {
        event.preventDefault();
      
        const formData = new FormData(event.target);
        const data = {};
      
        formData.forEach((value, key) => {
          data[key] = value;
        });
      
        try {
          const result = await postData(endpoint_add, data, allowheaders);
          let response = JSON.parse(result);
          // console.log("POST request Successful:", response);
          toast.success(response.message);
          navigate('/admin');
        } catch (error) {
          console.log('Failed to make POST request:', error);
          let response = JSON.parse(error.message);
            if(response.error === true){
                toast.error(response.message);
            }
        }
    }



    return (
        <div className="main-content">
            
            <ResponsiveHeader />

            <div className="panel-body">
                <div className="content-area">
                {/* Bread Crumb  */}
                <div className="sub-bar">
                    <div className="sub-title">
                        <h4>Admin</h4>
                    </div>
                    <ul className="bread-crumb">
                        <li><Link to="/dashboard" title="">Home</Link></li>
                        <li>Admin</li>
                    </ul>
                </div>
                {/* Bread Crumb */}


                {/* Page Content */}
                <div className="gap no-gap">
                    <div className="inner-bg">
                        <div className="element-title">
                            <h4>Add Admin</h4>
                            <span>Please fill the form bellow.</span>
                        </div>

                        <div className="add-prod-from">
                            <form id='addAdmin'>
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <label>Username</label>
                                        <input type="text" placeholder="Username"
                                        name='username' required />
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Email</label>
                                        <input type="text" placeholder="Email"
                                        name='email' required />
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Role</label>
                                        <select name='role' required>
                                            <option value="">--Select Role--</option>
                                            <option value="1">Admin</option>
                                            <option value="2">Sub admin</option>
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Password</label>
                                        <input type="password" placeholder="Password"
                                        name='password' required />
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Confirm Password</label>
                                        <input type="password" placeholder="Confirm Password"
                                        name='cpassword' required />
                                    </div>

                                    <div className="col-md-12">
                                        <label>&nbsp;</label>
                                        <div className="button mt-1">
                                            <button className='btn btn-primary' type="submit">save</button>
                                            <button className='btn btn-default ml-3' type="reset">cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Page Content */}

                </div>
            </div>
        </div>
    )
}

export default AddAdmin