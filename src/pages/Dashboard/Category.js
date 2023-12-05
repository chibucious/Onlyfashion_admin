import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteData, fetchData, postData, putData } from '../../api/apiService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const Category = () => {

    // Delete Modal
    const [categoryIdForAction, setCategoryIdForAction] = useState(null);
    const [fetchedCategories, setfetchedCategories] = useState(null);
    const [fetchedPagination, setFetchedPagination] = useState([]);

    const [deleteRunning, setDeleteRunning] = useState(false);
    const [functionRunning, setFunctionRunning] = useState(false);

    const endpoint_fetchcategories = '/category/fetch';
    const endpoint_add = '/category/add';
    const endpoint_deletecategory = '/category/delete';
    const endpoint_edit = '/category/edit';
    const authToken = Cookies.get('userAuthFashionBlogModerator');

    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }


    useEffect(() => {
        fetchCategoryAsync();

        // Attach the event listener for form submission
        const add = document.getElementById('addcategory');
        add.addEventListener('submit', handleAddCategory);

        const edit = document.getElementById('editCategory');
        edit.addEventListener('submit', handleEditCategory);


        // Cleanup by removing the event listener when component is unmounted
        return () => {
            add.removeEventListener('submit', handleAddCategory);
            edit.removeEventListener('submit', handleEditCategory);
        };
    }, []);


    const fetchCategoryAsync = async () => {
        try {
        const result = await fetchData(endpoint_fetchcategories);
        if(result.error){
            toast.error(result.message);
        }
        console.log("Categories ", result);
        setfetchedCategories(result.data);
        } catch (error) {
        console.error('Error:', error.message);
        }
    };

    async function handleAddCategory(event) {
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
          fetchCategoryAsync();
        } catch (error) {
          console.log('Failed to make POST request:', error);
          let response = JSON.parse(error.message);
            if(response.error === true){
                toast.error(response.message);
            }
        }
    }

    const deleteModal = document.getElementById('delete_modal');
    const deleteCategory = async (categoryID)=>{
        // $(".lbtn").show(); $(".nlbtn").hide();
        // Ensure the function runs only once
        if (deleteRunning) return;
        try {
            // Set a flag to indicate the function is running
            setDeleteRunning(true);
            const result = await deleteData(endpoint_deletecategory+"/"+categoryID, allowheaders);
            let response = JSON.parse(result);
            console.log("DELETE request Deleted:", response);
            toast.success(response.message);
            deleteModal.classList.toggle('show');
            deleteModal.removeAttribute('dialog');
            fetchCategoryAsync();
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

    const populateDataByID = async (ID)=>{
        // Ensure the function runs only once
        if (functionRunning) return;
        try {
            // Set a flag to indicate the function is running
            setFunctionRunning(true);
            const result = await fetchData(endpoint_fetchcategories+"/"+ID);
            console.log("Fetch single request:", result);
            document.getElementById('categName').value = result.data[0].name;
            document.getElementById('singleCategID').value = result.data[0].id;
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

    async function handleEditCategory(event) {
        const editModal = document.getElementById('edit_modal');
        event.preventDefault();
      
        const formData = new FormData(event.target);
        const data = {};
      
        formData.forEach((value, key) => {
          data[key] = value;
        });
      
        try {
          const id = document.getElementById('singleCategID').value;
          const result = await putData(endpoint_edit+"/"+id, data, allowheaders);
          let response = JSON.parse(result);
          // console.log("POST request Successful:", response);
          toast.success(response.message);
          fetchCategoryAsync();
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
                            <h4>Category</h4>
                        </div>
                        <ul className="bread-crumb">
                            <li><Link to="/dashboard" title="">Home</Link></li>
                            <li>Category</li>
                        </ul>
                    </div>
                    {/* Bread Crumb */}


                    {/* Page Content */}
                    <div className="gap no-gap">
                        <div className="inner-bg">
                            <div className="element-title">
                                <h4>Add Category</h4>
                                <span>Please fill the form bellow.</span>
                            </div>

                            <div className="add-prod-from">
                                <form id='addcategory'>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Category name</label>
                                            <input type="text" placeholder="Name"
                                            name='name' required />
                                        </div>

                                        <div className="col-md-6">
                                            <label>&nbsp;</label>
                                            <div className="button mt-1">
                                                <button className='btn btn-primary' type="submit">Add</button>
                                                <button className='btn btn-default ml-3' type="reset">cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="gap no-gap mt-4">
                        <div className="inner-bg">
                            <div className="element-title">
                                <h4>Categories</h4>
                            </div>

                            <div className='table-styles'>
                                <div className="widget">
                                <table className="prj-tbl striped bordered table-responsive">
                                    <thead className="">
                                    <tr>
                                        <th><em>Name</em></th>
                                        <th><em>Created</em></th>
                                        <th><em>Action</em></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchedCategories ? "Loading..." : fetchedCategories.map((data, index) => (
                                            <tr key={index}>
                                                <td><i>{data.name}</i></td>
                                                <td><i>{data.created_at}</i></td>
                                                <td>
                                                    <Link className='btn py-1 bg-primary text-white' data-bs-toggle="modal" data-bs-target="#edit_modal" onClick={() => {
                                                        setCategoryIdForAction(data.id); populateDataByID(data.id);
                                                    }}>
                                                        Edit
                                                    </Link>
                                                    <span className='btn py-1 btn-danger ms-2' data-bs-toggle="modal" data-bs-target="#delete_modal" onClick={() => setCategoryIdForAction(data.id)}>
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
                        <button type="button" className="btn btn-danger ms-2 nlbtn" onClick={()=>deleteCategory(categoryIdForAction)}>Delete</button>
                        <button type="button" className="btn btn-danger ms-2 lbtn" style={{display:'none'}} disabled>Loading...</button>
                    </div>
                </div>
            </div>
        </div>
        {/* MODALS */}
        </>
    )
}

export default Category