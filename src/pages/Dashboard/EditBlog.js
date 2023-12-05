import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { decryptData } from '../../utilities/reusablefunctions_variables';
import { fetchData, postData, putData } from '../../api/apiService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const EditBlog = () => { 

    const navigate = useNavigate();

    const [addEditorData, setEditorVal] = useState('');
    const [addedEditorData, setAddedEditorData] = useState(0);

    const handleEditorChange = (e, editor) => {
        const data = editor.getData();
        setEditorVal(data);
    };

    const authToken = Cookies.get('userAuthFashionBlogModerator');
    const allowheaders = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }
    const allowheaders2 = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'  // Add this line to set the content type
        }
    }

    const params = new URLSearchParams(window.location.search);
    const encryptedBlogID = params.get('blogID');

    const decryptedBlogID = decryptData(encryptedBlogID, 'blogid')

    const [singleBlogPost, setSingleBlogPost] = useState(null);
    const [fetchedCategories, setfetchedCategories] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const endpoint_fetch = '/blog/fetch?id='+decryptedBlogID; // Replace with your API endpoint
    const endpoint_categories = '/category/fetch';
    const endpoint_edit = '/blog/edit/'+decryptedBlogID;

    useEffect(() => {
        fetchCategoryAsync();
        fetchSingleBlogAsync();

        // Attach the event listener for form submission
        const edit = document.getElementById('editblog');
        edit.addEventListener('submit', handleEditBlog);

        // Cleanup by removing the event listener when component is unmounted
        return () => {
            edit.removeEventListener('submit', handleEditBlog);
        };
    }, []);

    const fetchSingleBlogAsync = async () => {
        try {
          const result = await fetchData(endpoint_fetch);
          console.log("Single Blog Posts ", result);
          setSingleBlogPost(result.data);
          let thedata = result.data;
          document.querySelector('#category').value = thedata.category;
          document.querySelector('#title').value = thedata.title;
          document.querySelector('#tags').value = thedata.tags;
          document.querySelector('#description').value = thedata.description;
          document.querySelector('#image_preview').src = thedata.image;
          setEditorVal(thedata.description);
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



    function handleCKEditorImageUpload(loader) {
        console.log("handleCKEditorImageUpload loader",loader);
        return {
          upload: () => {
            return new Promise(async (resolve, reject) => {
              try {
                const file = await loader.file;

                console.log("handleCKEditorImageUpload loader.file ", file);
      
                const formData = new FormData();
                formData.append("image", file);

                console.log("handleCKEditorImageUpload formData ",formData)
      
                const uploadResponse = await fetch('https://medicare-com.stackstaging.com/filescloud/upload.php', {
                  method: 'POST',
                  body: formData,
                });
      
                if (!uploadResponse.ok) {
                  throw new Error('Image upload failed');
                }
      
                const responseData = await uploadResponse.json();
      
                // Extract the image link from the API response
                const imageUrl = responseData.data.imageLink;
      
                resolve({ default: imageUrl });
              } catch (error) {
                console.error(error);
                reject(error);
              }
            });
          },
        };
    }
      
    console.log("Before calling uploadPlugin");
    function uploadPlugin(editor) {
        console.log("Inside uploadPlugin");
        console.log("Editor instance:", editor);
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return handleCKEditorImageUpload(loader);
        };
    }


  
    const handleImageChange = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };




    async function handleEditBlog(event) {
        event.preventDefault();
    
        // Retrieve form data
        const category = document.querySelector('#category').value;
        const title = document.querySelector('#title').value;
        const description = document.querySelector('#description').value;
        const tags = document.querySelector('#tags').value;
    
        // Check if image is selected
        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];
        const imageformData = new FormData();
        if (!imageFile) {
            console.log("No new image selected");
        }else{
            // Extract file name and trim
            const fileName = imageFile.name.trim();

            // imageformData.append("image", imageFile);
            imageformData.append("image", imageFile, fileName);
        }

        
    
        const formData = new FormData();
        formData.append("category", category);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
    
        try {
            let imageUploadData;
            if(imageFile){
                // Send image upload request
                const imageUploadResponse = await fetch('https://medicare-com.stackstaging.com/filescloud/upload.php', {
                    method: 'POST',
                    body: imageformData
                });
        
                if (!imageUploadResponse.ok) {
                    throw new Error('Image upload failed');
                }
        
                imageUploadData = await imageUploadResponse.json();

                console.log("imageUploadData ", imageUploadData);
        
                // Append image link to form data
                formData.append("image", imageUploadData.data.imageLink); 
            }else{
                formData.append("image", "none"); 
            }
            console.log("formData ",formData);
            // Send data post request
            const postDataResponse = await putData(endpoint_edit, formData, allowheaders2);
    
            const postDataResult = JSON.parse(postDataResponse);
            console.log('postDataResult', postDataResult);  // Convert to string for logging
            console.log('imageUploadData', imageUploadData);
            
            if(!imageUploadData && postDataResult.error === false){
                toast.success(postDataResult.message);
                setTimeout(()=>{
                    navigate('/blogs');  
                },2000)
                return;
            }
            if (imageUploadData.error === false && postDataResult.error === false) {
                toast.success(postDataResult.message);
                setTimeout(()=>{
                    navigate('/blogs');  
                },2000)
            } else {
                toast.error("Request failed, Either image upload or other data failed to process");
            }
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
                        <h4>Blog</h4>
                    </div>
                    <ul className="bread-crumb">
                        <li><Link to="/dashboard" title="">Home</Link></li>
                        <li>Blog</li>
                    </ul>
                </div>
                {/* Bread Crumb */}


                {/* Page Content */}
                <div className="gap no-gap">
                    <div className="inner-bg">
                        <div className="element-title">
                            <h4>Edit Post</h4>
                            <span>Please fill the form bellow.</span>
                        </div>
                        
                        <div className="add-prod-from">
                            <form id='editblog' enctype="multipart/form-data">
                                {!fetchedCategories ? "Loading..." : (
                                    <div className="row">
                                        <div className='row col-7'>
                                            <div className="col-md-6 mb-2">
                                                <label>Select Category</label>
                                                <select name='category' id='category' required>
                                                    <option value="">--Select--</option>
                                                    {!fetchedCategories ? null : fetchedCategories.map((data, index)=>(
                                                        <option key={index} value={data.id}>{data.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label>Select Tags</label>
                                                <select name='tags' id='tags' required>
                                                    <option value="1">Tag</option>
                                                </select>
                                            </div>

                                            <div className="col-md-12 mb-2">
                                                <label>Image</label>
                                                <input type="file" accept="image/*" placeholder="Image" onChange={handleImageChange} id='image'
                                                name='image' />
                                            </div>

                                            <div className="col-md-12 mb-2">
                                                <label>Title</label>
                                                <input type='text' placeholder='title' id='title'
                                                name="title" required />
                                            </div>
                                        </div>

                                        <div className='row col-5'>
                                            <div className="feature-img" style={{ height: '300px', margin:'auto', background:"gray" }}>

                                                <img className="img-fluid" id='image_preview'
                                                    src={!imagePreviewUrl ? "" : imagePreviewUrl}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} alt="Bimg" 
                                                />
                                            </div>
                                        </div>

                                        {/* npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic */}
                                        <div className="col-md-12 mb-2">
                                            <label>Description</label>
                                            {/* <button style={{ backgroundColor: 'black', color: 'white' }}
                                                onClick={() => setAddedEditorData(!addedEditorData)}>
                                                {addedEditorData ? 'Hide Data' : 'Show Data'}
                                            </button> */}
                                            <CKEditor editor={ClassicEditor} data={addEditorData} onChange={handleEditorChange} 
                                                config={{
                                                    extraPlugins: [uploadPlugin, 'Heading',],
                                                    removePlugins: ['Font', 'MediaEmbed'],
                                                  }}
                                            />
                                            <div>
                                                {addedEditorData ? addEditorData : ""}
                                                <input type='hidden' value={!addedEditorData ? addEditorData : ""} id='description'
                                                name='description' required />
                                            </div>
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
    )
}

export default EditBlog