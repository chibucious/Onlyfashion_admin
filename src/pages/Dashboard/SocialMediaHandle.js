import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteData, fetchData, postData, putData } from '../../api/apiService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const SocialMediaHandle = () => {

    const [socialhandleIdForAction, setSocialhandleIdForAction] = useState(null);
    const [fetchedSocialHandles, setfetchedSocialHandles] = useState(null);

    const [functionRunning, setFunctionRunning] = useState(false);

    const endpoint_fetchsocialhandles = '/socialmedia/fetch';
    const endpoint_edit = '/socialmedia/edit';
    const authToken = Cookies.get('userAuthFashionBlogModerator');

    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }


    useEffect(() => {
        fetchSocialhandleAsync();

        const edit = document.getElementById('editSocialMediaHandle');
        edit.addEventListener('submit', handleEditSocialMediaHandle);


        // Cleanup by removing the event listener when component is unmounted
        return () => {
            edit.removeEventListener('submit', handleEditSocialMediaHandle);
        };
    }, []);


    const fetchSocialhandleAsync = async () => {
        try {
            const result = await fetchData(endpoint_fetchsocialhandles);
            if(result.error){
                toast.error(result.message);
            }
            console.log("SocialHandles ", result);
            setfetchedSocialHandles(result.data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    
    const populateDataByID = async (ID)=>{
        // Ensure the function runs only once
        if (functionRunning) return;
        try {
            // Set a flag to indicate the function is running
            setFunctionRunning(true);
            const result = await fetchData(endpoint_fetchsocialhandles+"/"+ID);
            console.log("Fetch single request:", result);
            document.getElementById('singleSocialMediaHandleID').value = result.data.id;
            document.getElementById('socialmedia_type').innerHTML = `<i class="fa fa-${result.data.socialmedia_type}"></i> `+ result.data.socialmedia_type;
            document.getElementById('handle').value = result.data.handle;
        } catch (error) {
            console.error('Failed to make fetch data:', error);
            let response = JSON.parse(error.message);
            // $(".lbtn").hide(); $(".nlbtn").show();
            if(response.error === true){
                toast.error(response.message);
            }
        }finally {
            setFunctionRunning(false);
        }
    }
    

    async function handleEditSocialMediaHandle(event) {
        const editModal = document.getElementById('edit_modal');
        event.preventDefault();
      
        const formData = new FormData(event.target);
        const data = {};
      
        formData.forEach((value, key) => {
          data[key] = value;
        });
      
        try {
          const id = document.getElementById('singleSocialMediaHandleID').value;
          const result = await putData(endpoint_edit+"/"+id, data, allowheaders);
          let response = JSON.parse(result);
          // console.log("POST request Successful:", response);
          toast.success(response.message);
          fetchSocialhandleAsync();
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
                            <h4>Social Media Handles</h4>
                        </div>
                        <ul className="bread-crumb">
                            <li><Link to="/dashboard" title="">Home</Link></li>
                            <li>Social Media Handles</li>
                        </ul>
                    </div>
                    {/* Bread Crumb */}


                    {/* Page Content */}
                    {/* TABLE */}
                    <div className="gap no-gap mt-4">
                        <div className="inner-bg">
                            <div className="element-title">
                                <h4>Social Media Handles</h4>
                            </div>

                            <div className='table-styles'>
                                <div className="widget">
                                <table className="prj-tbl striped bordered table-responsive">
                                    <thead className="">
                                    <tr>
                                        <th><em>Social Media</em></th>
                                        <th><em>Handle</em></th>
                                        <th><em>Action</em></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchedSocialHandles ? "Loading..." : fetchedSocialHandles.map((data, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <i className={
                                                        data.socialmedia_type === "facebook" ? "fa fa-facebook" :
                                                        data.socialmedia_type === "youtube" ? "fa fa-youtube" :
                                                        data.socialmedia_type === "twitter" ? "fa fa-twitter" :
                                                        data.socialmedia_type === "tiktok" ? "fa fa-tiktok" :
                                                        data.socialmedia_type === "threads" ? "fa fa-threads" :
                                                        data.socialmedia_type === "instagram" ? "fa fa-instagram" : ""
                                                    }>
                                                    </i> 
                                                    &nbsp;
                                                    <i>{data.socialmedia_type}</i>
                                                </td>
                                                <td><i>{data.handle}</i></td>
                                                <td>
                                                    <Link className='btn py-1 bg-primary text-white' data-bs-toggle="modal" data-bs-target="#edit_modal" onClick={() => {
                                                        setSocialhandleIdForAction(data.id); populateDataByID(data.id);
                                                    }}>
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TABLE */}
                    {/* Page Content */}


                </div>
            </div>
        
        </div>

        {/* MODALS */}
        <div className="modal modal-backdrop fade" id="edit_modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form id='editSocialMediaHandle'>
                        <input type='hidden' id='singleSocialMediaHandleID' />
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            
                            <div className="add-prod-from">                         
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Social Media Handle</label>
                                        <label className='d-block' id='socialmedia_type'>...Loading</label>
                                        <input type="text" placeholder="Name" id='handle'
                                        name='newhandle' required />
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


    
        </>
    )
}

export default SocialMediaHandle