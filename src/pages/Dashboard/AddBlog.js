import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchData, postData } from '../../api/apiService';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { logout } from '../../utilities/reusablefunctions_variables';
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';

const AddBlog = () => { 

    const navigate = useNavigate();

    const [addEditorData, setEditorVal] = useState('');
    const [addedEditorData, setAddedEditorData] = useState(0);

    const handleEditorChange = (e, editor) => {
        const data = editor.getData();
        setEditorVal(data);
    };

    // function handleCKEditorImageUpload(loader) {
    //     return {
    //       upload: () => {
    //         return new Promise((resolve, reject) => {
    //           loader.file
    //             .then((file) => {
    //               return new Promise((fileResolve) => {
    //                 const reader = new FileReader();
    //                 reader.onload = (event) => {
    //                   fileResolve(event.target.result);
    //                 };
    //                 reader.readAsDataURL(file);
    //               });
    //             })
    //             .then((base64Data) => {
    //               // Include the prefix for PNG images
    //               resolve({ default: `data:image/png;base64,${base64Data}` });
    //             })
    //             .catch((err) => {
    //               console.log(err);
    //               reject(err);
    //             });
    //         });
    //       },
    //     };
    //   }
      
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
      
      
    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
      
      

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

    const [fetchedCategories, setfetchedCategories] = useState(null);
    const [newimage, setImages] = useState(null);

    const endpoint_fetchcategories = '/category/fetch';
    const endpoint_add = '/blog/add';

    useEffect(() => {
        setAddedEditorData(!addedEditorData);
        fetchCategoryAsync();

        // Attach the event listener for form submission
        const add = document.getElementById('addblog');
        add.addEventListener('submit', handleAddBlog);

        // Cleanup by removing the event listener when component is unmounted
        return () => {
            add.removeEventListener('submit', handleAddBlog);
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

    let globalImageFile;
    const handleImageChange = (event) => {
        // const files = event.target.files;
        const imageFile = event.target.files[0];  // Get the first file (assuming single file selection)
        globalImageFile = imageFile;
        console.log(globalImageFile)
        setImages(globalImageFile);
    };

    async function handleAddBlog(event) {
        event.preventDefault();
    
        // Retrieve form data
        const category = document.querySelector('#category').value;
        const title = document.querySelector('#title').value;
        const description = document.querySelector('#description').value;
        const tags = document.querySelector('#tags').value;
    
        // Check if image is selected
        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];
        if (!imageFile) {
            toast.error("Please reselect the image");
            console.log(imageFile)
            return;
        }
    
        const formData = new FormData();
        const imageformData = new FormData();
        imageformData.append("image", imageFile);
        formData.append("category", category);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
    
        try {
            // Send image upload request
            const imageUploadResponse = await fetch('https://medicare-com.stackstaging.com/filescloud/upload.php', {
                method: 'POST',
                body: imageformData
            });
    
            if (!imageUploadResponse.ok) {
                throw new Error('Image upload failed');
            }
    
            const imageUploadData = await imageUploadResponse.json();

            console.log("imageUploadData ", imageUploadData);
    
            // Append image link to form data
            formData.append("image", imageUploadData.data.imageLink); 
    
            // Send data post request
            const postDataResponse = await postData(endpoint_add, formData, allowheaders2);
    
            const postDataResult = JSON.parse(postDataResponse);
            console.log('postDataResult', postDataResult);  // Convert to string for logging
            console.log('imageUploadData', imageUploadData);
            
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
                            <h4>Add Post</h4>
                            <span>Please fill the form bellow.</span>
                        </div>

                        <div className="add-prod-from">
                            <form id='addblog' enctype="multipart/form-data">
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <label>Select Category</label>
                                        <select name='category' id='category' required>
                                            <option value="">--Select--</option>
                                            {!fetchedCategories ? null : fetchedCategories.map((data, index)=>(
                                                <option value={data.id}>{data.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Select Tags</label>
                                        <select name='tags' id='tags' required>
                                            <option value="1">Tag</option>
                                        </select>
                                    </div>

                                    <div className="col-md-3 mb-2">
                                        <label>Image</label>
                                        <input type="file" placeholder="Image" onChange={handleImageChange} id='image'
                                        name='image' required />
                                    </div>

                                    {/* <div className="col-md-3 mb-2">
                                        <label>Status</label>
                                        <select name='status' required>
                                            <option value="1">Publish</option>
                                        </select>
                                    </div> */}

                                    <div className="col-md-12 mb-2">
                                        <label>Title</label>
                                        <input type='text' accept="image/*" placeholder='title' id='title'
                                        name="title" required />
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
                                            {!addedEditorData ? addEditorData : ""}
                                            <input type='text' value={addedEditorData ? addEditorData : ""} id='description'
                                            name='description' required />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <label>&nbsp;</label>
                                        <div className="button mt-1">
                                            <button type="submit" className="btn btn-danger ms-2 nlbtn">Save</button>
                                            <button type="button" className="btn btn-danger ms-2 lbtn" style={{display:'none'}} disabled>Loading...</button>
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

export default AddBlog