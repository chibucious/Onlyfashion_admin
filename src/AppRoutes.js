import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Category from './pages/Dashboard/Category'
import Admin from './pages/Dashboard/Admin'
import AddAdmin from './pages/Dashboard/AddAdmin'
import EditAdmin from './pages/Dashboard/EditAdmin'
import AddBlog from './pages/Dashboard/AddBlog'
import Blogs from './pages/Dashboard/Blogs'
import EditBlog from './pages/Dashboard/EditBlog'
import SingleBlog from './pages/Dashboard/SingleBlog'
import Settings from './pages/Dashboard/Settings'
import SocialMediaHandle from './pages/Dashboard/SocialMediaHandle'
import AboutInfo from './pages/Dashboard/AboutInfo'
import SiteInfo from './pages/Dashboard/SiteInfo'
import Logout from './pages/Dashboard/Logout'

const AppRoutes = () => {

    return (
        <div class="panel-layout">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="main-page">

                            <Routes>
                                <Route path="/" element={ <Dashboard/> } />
                                <Route path="/dashboard" element={ <Dashboard/> } />
                                <Route path="/category" element={ <Category/> } />

                                <Route path="/add-admin" element={ <AddAdmin/> } />
                                <Route path="/edit-admin" element={ <EditAdmin/> } />
                                <Route path="/admin" element={ <Admin/> } />
                                <Route path="/settings" element={ <Settings/> } />

                                <Route path="/add-blog" element={ <AddBlog/> } />
                                <Route path="/edit-blog" element={ <EditBlog/> } />
                                <Route path="/blogs" element={ <Blogs/> } />
                                <Route path="/single-blog" element={ <SingleBlog/> } />
                                
                                <Route path="/socialmedia_handles" element={ <SocialMediaHandle/> } />
                                
                                <Route path="/about_info" element={ <AboutInfo/> } />
                                <Route path="/site_info" element={ <SiteInfo/> } />

                                {/* Redirect for unknown routes */}
                                {/* <Route path="*" element={ <Dashboard/> } /> */}
                                <Route path="/login" element={<Navigate to="/dashboard" />} />
                                <Route path="/logout" element={ <Logout/> } />
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    


    )
}

export default AppRoutes