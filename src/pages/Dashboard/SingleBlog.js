import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { decodeHTMLEntities, decryptData } from '../../utilities/reusablefunctions_variables';
import { fetchData } from '../../api/apiService';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const SingleBlog = () => {

    const params = new URLSearchParams(window.location.search);
    const encryptedBlogID = params.get('blogID');

    const decryptedBlogID = decryptData(encryptedBlogID, 'blogid')

    const [singleBlogPosts, setSingleBlogPosts] = useState(null);
    const [fetchedCategories, setfetchedCategories] = useState(null);
    const [editorData, setEditorData] = useState('<p> </p>');

    const endpoint_fetch = '/blog/fetch?id='+decryptedBlogID; // Replace with your API endpoint
    const endpoint_categories = '/category/fetch';

    useEffect(() => {
        fetchCategoryAsync();
        fetchSingleBlogAsync();
    }, []);

    const fetchSingleBlogAsync = async () => {
        try {
          const result = await fetchData(endpoint_fetch);
          console.log("Single Blog Posts ", result);
          setSingleBlogPosts(result.data);
          setEditorData(result.data.description);
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
        console.log(category)
        return category ? category.name : 'Unknown Category';
    };
    // RETRIEVE CATEGORY NAME WITH THE HELP OF category id USING THE FETCHCATEGORIES MAPPED API DATA

    return (
        <div className="main-content">
            
            <ResponsiveHeader />

            <div className="panel-body">
                <div className="content-area">
                    {/* Bread Crumb  */}
                    <div className="sub-bar">
                        <div className="sub-title">
                            <h4>Blog</h4>
                        </div>
                        <ul className="bread-crumb">
                            <li><Link to="/dashboard" title="">Home</Link></li>
                            <li>Blog</li>
                        </ul>
                    </div>
                    {/* Bread Crumb */}



                    <section className="blog_area single-post-area all_post">
                        <div className="row">
                            <div className="col-lg-12 posts-list">
                                {!singleBlogPosts ? "Loading Posts..." : (
                                    <>
                                    {!fetchedCategories ? "Loading Categories..." : (
                                    <>
                                    <div className="single-post row d-flex align-items-center">
                                        <div className="feature-img col-lg-6 col-md-6 col-sm-12" style={{ height: '550px', margin:'auto', background:"transparent" }}>
                                            <img className="img-fluid" 
                                                src={singleBlogPosts.image} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} alt="Post Bimg" 
                                            />
                                        </div>
                                        <div className="blog_details col-lg-6 col-md-6 col-sm-12">
                                            <h2>Title:</h2>
                                            <h3 className='mt-0'>{singleBlogPosts.title} </h3>
                                            <ul className="blog-info-link mt-3 mb-4 d-flex">
                                                <li><Link><i className="fa fa-user"></i> {getCategoryNameFromID(singleBlogPosts.category)}</Link></li>
                                                {/* &nbsp; | &nbsp;
                                                <li><Link><i className="fa fa-comments"></i> 03 Comments</Link></li> */}
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='col-12 mt-4'>
                                            <h3>Description</h3>
                                            {/* Display the content outside the CKEditor */}
                                            <div dangerouslySetInnerHTML={{ __html: editorData }} />
                                        </div>
                                    </div>
                                    </>
                                    )}
                                </>
                                )}
                            </div>  
                        
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}

export default SingleBlog