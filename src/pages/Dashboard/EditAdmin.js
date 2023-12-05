import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { fetchData, putData } from '../../api/apiService'
import { decryptData } from '../../utilities/reusablefunctions_variables'
import ResponsiveHeader from '../../components/Header/ResponsiveHeader'

const EditAdmin = () => {

    const navigate = useNavigate();

    const authToken = Cookies.get('userAuthFashionBlogModerator');
    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }

    const params = new URLSearchParams(window.location.search);
    const encryptedAdminID = params.get('admin');

    const decryptedAdminID = decryptData(encryptedAdminID, 'adminid')

    const endpoint_fetch = '/user/fetch/'+decryptedAdminID; // Replace with your API endpoint
    const endpoint_edit = '/user/edit/'+decryptedAdminID;

    useEffect(() => {
        fetchSingleAdminAsync();

        // Attach the event listener for form submission
        const edit = document.getElementById('editAdmin');
        edit.addEventListener('submit', handleEditAdmin);

        // Cleanup by removing the event listener when component is unmounted
        return () => {
            edit.removeEventListener('submit', handleEditAdmin);
        };
    }, []);

    const fetchSingleAdminAsync = async () => {
        try {
          const result = await fetchData(endpoint_fetch);
          console.log("Single User ", result);
          let thedata = result.data[0];
          document.getElementById('username').value = thedata.username;
          document.getElementById('email').value = thedata.email;
          document.getElementById('role').value = thedata.role;
        } catch (error) {
          console.error('Error:', error.message);
        }
    };

    async function handleEditAdmin(event) {
        event.preventDefault();
    
        // Retrieve form data
        const formData = new FormData(event.target);
        const data = {};
      
        formData.forEach((value, key) => {
          data[key] = value;
        });

        console.log(data);
    
        try {
            const result = await putData(endpoint_edit, data, allowheaders);
            let response = JSON.parse(result);
            console.log("POST request Successful:", response);
            toast.success(response.message);
            navigate('/admin');
        } catch (error) {
            console.log('Failed to make request:', error);
    
            let errorObject;
            if (typeof error === 'string') {
                // Extract the JSON string from the error message
                const jsonString = error.substring(error.indexOf('{'), error.lastIndexOf('}') + 1);
        
                // Parse the JSON string into an object
                errorObject = JSON.parse(jsonString);
            } else if (typeof error === 'object' && error.message) {
                errorObject = error;
            }
        
            console.log(errorObject);
        
            // Now you can access properties of the errorObject, for example:
            let errorMessage = errorObject.message;
            console.log(errorMessage);
            if(errorMessage.includes('undefined')){
                toast.error(errorMessage);
            }else if (errorMessage.includes('NetworkError')) {
                // If it's a NetworkError
                toast.error('Network error occurred.');
            } else {
                // If it's another type of error or a parsed JSON error message
                toast.error(JSON.parse(errorMessage).message);
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
                            <h4>Edit Admin</h4>
                            <span>Please fill the form bellow.</span>
                        </div>

                        <div className="add-prod-from">
                            <form id='editAdmin'>
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <label>Username</label>
                                        <input type="text" placeholder="Username" id='username'
                                        name='username' required />
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Email</label>
                                        <input type="text" placeholder="Email" id='email'
                                        name='email' required />
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Role</label>
                                        <select id='role' name='role' required>
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

export default EditAdmin