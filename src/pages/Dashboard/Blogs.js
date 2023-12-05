import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addEllipses, decodeHTMLEntities, encryptData, replaceQuotationMarks } from '../../utilities/reusablefunctions_variables'
import { deleteData, fetchData } from '../../api/apiService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const Blogs = () => {

    const [blogPosts, setBlogPosts] = useState(null);
    const [fetchedCategories, setfetchedCategories] = useState(null);
    const [fetchedPagination, setFetchedPagination] = useState([]);

    const [deleteRunning, setDeleteRunning] = useState(false);

    const endpoint_fetch = '/blog/fetch'; // Replace with your API endpoint
    const endpoint_categories = '/category/fetch';
    const endpoint_delete = '/blog/delete';
    const authToken = Cookies.get('userAuthFashionBlogModerator');

    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }

    useEffect(() => {
        fetchCategoryAsync();
        fetchBlogAsync();
    }, []);

    const fetchBlogAsync = async (paginationRoute) => {
        try {
        //   const result = await fetchData(!paginationRoute ? endpoint : paginationRoute+"&perpage=2");
          const result = await fetchData(!paginationRoute ? endpoint_fetch : paginationRoute);
          console.log("Blog Posts ", result);
          setBlogPosts(result.data);
          setFetchedPagination(result.links);
        } catch (error) {
          console.error('Error:', error.message);
        }
    };

    const fetchCategoryAsync = async () => {
        try {
          const result = await fetchData(endpoint_categories);
          console.log("Categories ", result);
          setfetchedCategories(result.data);
        } catch (error) {
          console.error('Error:', error.message);
        }
    };

    // RETRIEVE CATEGORY NAME WITH THE HELP OF category id USING THE FETCHCATEGORIES MAPPED API DATA
    const getCategoryNameFromID = (categoryID) => {
        const category = fetchedCategories.find(category => category.id === categoryID);
        // console.log(category)
        return category ? category.name : 'Unknown Category';
    };
    // RETRIEVE CATEGORY NAME WITH THE HELP OF category id USING THE FETCHCATEGORIES MAPPED API DATA

    // Delete Modal
    const [blogIdToDelete, setBlogIdToDelete] = useState(null);

    const deleteModal = document.getElementById('delete_modal');
    const deleteBlog = async (id)=>{
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
            fetchBlogAsync();
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
                                <h4>Post</h4>
                            </div>
                            <ul className="bread-crumb">
                                <li><Link to="/dashboard" title="">Home</Link></li>
                                <li>Post</li>
                            </ul>
                        </div>
                        {/* Bread Crumb */}

                        {/* TABLE */}
                        <div className="gap no-gap mt-4">
                            <div className="inner-bg">
                                <div className="element-title">
                                    <h4>Posts List</h4>
                                </div>

                                <div className='table-styles'>
                                    <div className="widget">
                                    <table className="prj-tbl striped bordered cart-table table-responsive">
                                        <thead className="">
                                        <tr>
                                            <th><em>Title</em></th>
                                            <th><em>Category</em></th>
                                            <th><em>Description</em></th>
                                            <th><em>Author</em></th>
                                            <th><em>Image</em></th>
                                            <th><em>Status</em></th>
                                            <th><em>Created</em></th>
                                            <th><em>Action</em></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {!blogPosts ? "Loading..." : blogPosts.map((blog,index) => (
                                                <>
                                                {!fetchedCategories ? "Loading Categories..." : (
                                                <tr key={index}>
                                                    <td><i>{addEllipses(blog.title, 100)}</i></td>
                                                    <td><i>{getCategoryNameFromID(blog.category)}</i></td>
                                                    <td><i>{decodeHTMLEntities(addEllipses(blog.description, 20))}</i></td>
                                                    <td><i>{blog.author_details.username}</i></td>
                                                    <td style={{ height: '90px', width:'65px' }}>
                                                        <img src={blog.image} alt="Postimg" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                                                    </td>
                                                    <td>
                                                        
                                                            {blog.status == 0 ? <span class="pending">Draft</span> : 
                                                             blog.status == 1 ? <span class="paid">Published</span> :
                                                             <span class="failed">Undefined</span>}
                                                        
                                                    </td>
                                                    <td><i>{blog.created_at}</i></td>
                                                    <td>
                                                        <div className="dropdown dropdown-action">
                                                            <Link to="/blogs" className=" btn-action-icon " data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="fa fa-ellipsis-v"></i>
                                                            </Link>
                                                            <div className="dropdown-menu dropdown-menu-end">
                                                                <ul>
                                                                    <li>
                                                                        <Link className="dropdown-item" to={`/edit-blog?blogID=${encryptData(blog.id, 'blogid')}`}>
                                                                        <i className="fa fa-edit me-2"></i>Edit 
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <Link className="dropdown-item" to={`/single-blog?blogID=${encryptData(blog.id, 'blogid')}`}>
                                                                        <i className="fa fa-eye me-2"></i>View 
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <Link className="dropdown-item" data-bs-toggle="modal" data-bs-target="#delete_modal" onClick={() => setBlogIdToDelete(blog.id)}>
                                                                        <i className="fa fa-trash me-2"></i>Delete
                                                                        </Link>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                )}
                                                </>
                                            ))}
                                        
                                        </tbody>
                                    </table>

                                    <div className="page_pageniation my-3">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination justify-content-center">
                                                {fetchedPagination.map((data, index) => (
                                                    <li key={index} role='button' onClick={()=>fetchBlogAsync(data.url)} className={`page-item 
                                                    ${data.active ? 'active':'disabled'}`}>
                                                        <Link className="page-link">
                                                            {replaceQuotationMarks(data.label).trim()}
                                                        </Link>
                                                    </li>
                                                    // <li className="page-item"><a className="page-link" href="index.html#">1</a></li>
                                                    // <li className="page-item"><a className="page-link" href="index.html#">2</a></li>
                                                    // <li className="page-item"><a className="page-link" href="index.html#">3</a></li>
                                                    // <li className="page-item"><a className="page-link" href="index.html#">Next</a></li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
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
                            <button type="button" className="btn btn-danger ms-2 nlbtn" onClick={()=>deleteBlog(blogIdToDelete)}>Delete</button>
                            <button type="button" className="btn btn-danger ms-2 lbtn" style={{display:'none'}} disabled>Loading...</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* MODALS */}
        </>
    )
}

export default Blogs