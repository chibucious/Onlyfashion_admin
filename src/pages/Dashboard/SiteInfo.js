import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteData, fetchData, postData, putData } from '../../api/apiService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const SiteInfo = () => {    
    
    const [categoryIdForAction, setCategoryIdForAction] = useState(null);
    const [fetchedSiteInfo, setfetchedSiteInfo] = useState(null);

    const [functionRunning, setFunctionRunning] = useState(false);

    const endpoint_fetchsiteinfo = '/sitedetails/fetch';
    const endpoint_edit = '/sitedetails/edit';

    const authToken = Cookies.get('userAuthFashionBlogModerator');
    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }

    


    useEffect(() => {
        fetchSiteInfoAsync();

        // Attach the event listener for form submission
        const edit = document.getElementById('editSiteDetails');
        edit.addEventListener('submit', handleEditSiteDetails);

        // Cleanup by removing the event listener when component is unmounted
        return () => {
            edit.removeEventListener('submit', handleEditSiteDetails);
        };
    }, []);


    const fetchSiteInfoAsync = async () => {
        try {
            const result = await fetchData(endpoint_fetchsiteinfo);
            if(result.error){
                toast.error(result.message);
            }
            console.log("Site Details ", result);
            let thedata = result.data;
            setfetchedSiteInfo(result.data[0]);
            document.querySelector('#address').value = thedata[0].primary_address;
            document.querySelector('#state_country').value = thedata[0].state_country;
            document.querySelector('#phone').value = thedata[0].phone;
            document.querySelector('#edit_email').value = thedata[0].email;
            document.querySelector('#work_hours').value = thedata[0].work_hours;
            document.querySelector('#mail_to').value = thedata[0].mail_to;
        } catch (error) {
            console.error('Error:', error.message);
        }
    };


    async function handleEditSiteDetails(event) {
        const editModal = document.getElementById('edit_modal');
        event.preventDefault();
      
        const formData = new FormData(event.target);
        const data = {};
      
        formData.forEach((value, key) => {
          data[key] = value;
        });
      
        try {
          const id = document.getElementById('singleCategID').value;
          const result = await putData(endpoint_edit, data, allowheaders);
          let response = JSON.parse(result);
          // console.log("POST request Successful:", response);
          toast.success(response.message);
          fetchSiteInfoAsync();
          editModal.classList.remove('show');
        } catch (error) {
          console.error('Failed to make request:', error);
          let response = JSON.parse(error.message);
            if(response.error === true){
                toast.error(response.message);
            }
            editModal.classList.remove('show');
        }
    }

    



    return (
        <>
        <div className="main-content">
            
            <ResponsiveHeader />

            <div className="panel-body">
                <div className="content-area">
                    {/* Bread Crumb  */}
                    <div className="sub-bar">
                        <div className="sub-title">
                            <h4>About Info</h4>
                        </div>
                        <ul className="bread-crumb">
                            <li><Link to="/dashboard" title="">Home</Link></li>
                            <li>About Info</li>
                        </ul>
                    </div>
                    {/* Bread Crumb */}


                    {/* Page Content */}
                    <div className="gap no-gap">
                        <div className="inner-bg">
                            <div className="element-title">
                                <h4>Edit Info</h4>
                                <span>Please fill the form bellow.</span>
                            </div>

                            <div className="add-prod-from">
                                <form id='editSiteDetails'>
                                    {!fetchSiteInfoAsync ? "Loading..." : (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="mb-1 mt-1">Address (State and Country not included)</label>
                                                <input type='text' id='address'
                                                    name='newPrimaryAddress' required />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="mb-1 mt-1">State and Country</label>
                                                <input type='text' id='state_country'
                                                    name='newStateandCountry' required />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="mb-1 mt-1">Phone</label>
                                                <input type='text' id='phone'
                                                    name='newPhone' required />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="mb-1 mt-1">Email</label>
                                                <input type='text' id='edit_email'
                                                    name='newEmail' required />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="mb-1 mt-1">Work hours</label>
                                                <input type='text' id='work_hours'
                                                    name='newWorkHours' required />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="mb-1 mt-1">Mail to</label>
                                                <input type='text' id='mail_to'
                                                    name='newMailto' required />
                                            </div>

                                            <div className="col-md-12">
                                                <label>&nbsp;</label>
                                                <div className="button mt-1">
                                                    <button className='btn btn-primary' type="submit">save</button>
                                                    <button className='btn btn-default ml-3' type="reset">cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    
                    {/* Page Content */}

                </div>
            </div>
        </div>

        {/* MODALS */}
        <div className="modal modal-backdrop fade" id="edit_modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form id='editCategory'>
                        <input type='hidden' id='singleCategID' />
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            
                            <div className="add-prod-from">                         
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Category name</label>
                                        <input type="text" placeholder="Name" id='categName'
                                        name='name' required />
                                    </div>
                                </div>                           
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-danger ms-2 nlbtn">Save</button>
                            <button type="button" className="btn btn-danger ms-2 lbtn" style={{display:'none'}} disabled>Loading...</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


        <div className="modal modal-backdrop fade" id="delete_modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Delete Confirmation</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete this item?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-danger ms-2 nlbtn">Delete</button>
                        <button type="button" className="btn btn-danger ms-2 lbtn" style={{display:'none'}} disabled>Loading...</button>
                    </div>
                </div>
            </div>
        </div>
        {/* MODALS */}
        </>
    )
}

export default SiteInfo