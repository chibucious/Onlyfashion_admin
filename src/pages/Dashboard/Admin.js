import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminTypeMap, encryptData } from '../../utilities/reusablefunctions_variables'
import { deleteData, fetchData } from '../../api/apiService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const Admin = () => {

    // Delete Modal
    const [adminIdForAction, setAdminIdForAction] = useState(null);
    const [fetchedAdmins, setfetchedAdmins] = useState([]);

    const endpoint_fetchadmin = '/user/fetch';
    const endpoint_delete = '/user/delete';
    const authToken = Cookies.get('userAuthFashionBlogModerator');

    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }

    useEffect(() => {
        fetchAdminAsync();
    },[])

    const fetchAdminAsync = async () => {
        try {
            const result = await fetchData(endpoint_fetchadmin, allowheaders);
            if(result.error){
                toast.error(result.message);
            }
            console.log("Admins ", result);
            setfetchedAdmins(result.data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const [deleteRunning, setDeleteRunning] = useState(false);
    const deleteModal = document.getElementById('delete_modal');
    const deleteAdmin = async (id)=>{
        // Ensure the function runs only once
        if (deleteRunning) return;
        try {
            // Set a flag to indicate the function is running
            setDeleteRunning(true);
            const result = await deleteData(endpoint_delete+"/"+id, allowheaders);
            let response = JSON.parse(result);
            console.log("DELETE request Deleted:", response);
            toast.success(response.message);
            deleteModal.classList.toggle('show');
            deleteModal.removeAttribute('dialog');
            fetchAdminAsync();
        } catch (error) {
            console.error('Failed to make DELETE request:', error);
            deleteModal.classList.toggle('show');
            deleteModal.removeAttribute('dialog');
            let response = JSON.parse(error.message);
            // $(".lbtn").hide(); $(".nlbtn").show();
            if(response.error === true){
                toast.error(response.message);
            }
        }finally {
            setDeleteRunning(false);
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
                                <h4>Admin</h4>
                            </div>
                            <ul className="bread-crumb">
                                <li><Link to="/dashboard" title="">Home</Link></li>
                                <li>Admin</li>
                            </ul>
                        </div>
                        {/* Bread Crumb */}

                        {/* TABLE */}
                        <div className="gap no-gap mt-4">
                            <div className="inner-bg">
                                <div className="element-title">
                                    <h4>Admin List</h4>
                                </div>

                                <div className='table-styles'>
                                    <div className="widget">
                                    <table className="prj-tbl striped bordered table-responsive">
                                        <thead className="">
                                        <tr>
                                            <th><em>Username</em></th>
                                            <th><em>Email</em></th>
                                            <th><em>Role</em></th>
                                            <th><em>Created</em></th>
                                            <th><em>Action</em></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {!fetchedAdmins ? "Loading ..." : fetchedAdmins.map((admin, index)=>(
                                                <tr>
                                                    <td><i>{admin.username}</i></td>
                                                    <td><i>{admin.email}</i></td>
                                                    <td><i>{adminTypeMap[admin.role]}</i></td>
                                                    <td><i>{admin.created_at}</i></td>
                                                    <td>
                                                        <Link className='btn py-1 bg-primary text-white' to={`/edit-admin?admin=${encryptData(admin.id, 'adminid')}`}>
                                                            Edit
                                                        </Link>
                                                        <span className='btn py-1 btn-danger ms-2' data-bs-toggle="modal" data-bs-target="#delete_modal" onClick={() => setAdminIdForAction(admin.id)}>
                                                            Delete
                                                        </span>
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

                    </div>
                </div>
            </div>

            {/* MODALS */}
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
                            <button type="button" className="btn btn-danger ms-2 nlbtn" onClick={()=>deleteAdmin(adminIdForAction)}>Delete</button>
                            <button type="button" className="btn btn-danger ms-2 lbtn" style={{display:'none'}} disabled>Loading...</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* MODALS */}
        </>
    )
}

export default Admin