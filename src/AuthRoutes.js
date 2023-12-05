import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'

const AuthRoutes = () => {
  return (
    <>
    {/* <!-- Start Page Loading --> */}
    <div id="loader-wrapper">
      <div id="loader"></div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
    </div>

    <div class="panel-layout">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    
                    <Routes>
                        <Route path='/' element={ <Login/> } />
                        <Route path='/login' element={ <Login/> } />
                        <Route path="*" element={ <Login/> } />
                    </Routes>

                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default AuthRoutes