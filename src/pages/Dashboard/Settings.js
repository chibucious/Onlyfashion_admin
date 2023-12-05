import React from 'react'
import ResponsiveHeader from '../../components/Header/ResponsiveHeader';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="main-content">
            
        <ResponsiveHeader />

        <div className="panel-body">
            <div className="content-area">
                {/* Bread Crumb  */}
                <div className="sub-bar">
                    <div className="sub-title">
                        <h4>Settings</h4>
                    </div>
                    <ul className="bread-crumb">
                        <li><Link to="/dashboard" title="">Home</Link></li>
                        <li>Settings</li>
                    </ul>
                </div>
                {/* Bread Crumb */}


                {/* Page Content */}
                <div className="gap no-gap">
                    <div className="inner-bg">
                        <div className="element-title">
                            <h4>Edit Profile</h4>
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
                {/* Page Content */}
            </div>
        </div>
    </div>
  )
}

export default Settings