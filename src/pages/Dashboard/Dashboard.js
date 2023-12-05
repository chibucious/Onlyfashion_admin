import React, { useEffect } from 'react'
import ResponsiveHeader from '../../components/Header/ResponsiveHeader'
import { fetchData } from '../../api/apiService';
import { toast } from 'react-toastify';

const Dashboard = () => {

  const endpoint_statistics = '/statistics/fetch';

  useEffect(() => {
    fetchStatisticsAsync();
}, []);

  const fetchStatisticsAsync = async () => {
    try {
      const result = await fetchData(endpoint_statistics);
      if(result.error){
          toast.error(result.message);
      }
      console.log("Statistics ", result);
      document.querySelector('#total_admin').innerHTML = result.data.admin_count;
      document.querySelector('#total_category').innerHTML = result.data.category_count;
      document.querySelector('#total_blog').innerHTML = result.data.blog_count;
    
    } catch (error) {
    console.error('Error:', error.message);
    }
  };

  return (
    <div className="main-content">

      <ResponsiveHeader />

      <div className="panel-body">
        <div className="content-area">
          <div className="sub-bar">
            <div className="sub-title">
                <h4>Dashboard:</h4>
                <span>Welcome To web Admin Panel!</span>
            </div>
            <ul className="bread-crumb">
                <li><a href="index.html#" title="">Home</a></li>
                <li>Dashbord</li>
            </ul>
          </div>

          {/* <!-- top subbar --> */}
          <div className="info-section">
            <div className="panel-widget">
            <div className="b-meta"> 
            <i className="icon-people"></i>
            <div className="info-meta">
                <h4 id='total_admin'>
                  {/* 4515 */}
                </h4>
              {/* <p>70%</p> */}
              <span>Total Admin</span> 
            </div>
            <span className="fifty blue"></span> 
            </div>
            </div>
            <div className="panel-widget">
            <div className="b-meta">
              <i className="icon-list"></i>
              <div className="info-meta">
                <h4 id='total_category'>
                  {/* 4515 */}
                </h4>
                {/* <p>50%</p> */}
                <span>Categories </span> 
              </div>
              <span className="fifty purpal"></span></div>
            </div>
            <div className="panel-widget">
            <div className="b-meta">
              <i className="fa fa-book"></i>
              <div className="info-meta">
                <h4 id='total_blog'>
                  {/* 4515 */}
                </h4>
                {/* <p>40%</p> */}
                <span>Total Posts </span> </div>
              <span className="fifty green"></span> </div>
            </div>
          </div>
          {/* <!-- top info widgets --> */}
       
        </div>
      </div>
    </div>
  )
}

export default Dashboard