import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { setupCommonFunctionality } from '../../utilities/headandsidebar';

const Sidebar = () => {

    useEffect(() => {
        setupCommonFunctionality();
        const menuItems = document.querySelectorAll('.side-menus li.menu-item-has-children');
    
        const handleMouseEnter = (event) => {
          const parent = event.currentTarget;
    
          // Close siblings' ul elements
          const siblings = Array.from(parent.parentElement.children).filter(child => child !== parent);
          siblings.forEach(sibling => {
            const ul = sibling.querySelector('ul');
            if (ul) {
              ul.style.display = 'none';
              sibling.classList.remove('active');
            }
          });
    
          // Toggle current ul and class
          const ul = parent.querySelector('ul');
          if (ul) {
            ul.style.display = 'block';
            parent.classList.add('active');
          }
        };
    
        const handleMouseLeave = (event) => {
          const parent = event.currentTarget;
          const ul = parent.querySelector('ul');
          if (ul) {
            ul.style.display = 'none';
            parent.classList.remove('active');
          }
        };
    
        menuItems.forEach(item => {
          item.addEventListener('mouseenter', handleMouseEnter);
          item.addEventListener('mouseleave', handleMouseLeave);
        });


        
    
        // Cleanup event listeners on component unmount
        return () => {
          menuItems.forEach(item => {
            item.removeEventListener('mouseenter', handleMouseEnter);
            item.removeEventListener('mouseleave', handleMouseLeave);
          });
        };
        
      }, []); // Empty dependency array ensures this effect runs once
    

      const here =()=>{
        // alert("rere");
      }



    return (
        <header>
            <div className="side-menus">
                <div className="side-header">
                    <div className="logo">
                       
                    </div>
                    <nav className="slide-menu">
                        <span>Navigation <i className="ti-layout"></i></span>
                        <ul className="parent-menu">
                            <li className="active"> 
                                <Link to="/dashboard">
                                    <i className="fa fa-dashboard"></i>
                                    <span>Dashboard</span>
                                </Link>
                            </li>

                            <li className="menu-item-has-children" onClick={here}> 
                                <Link title="">
                                    <i className="fa fa-list-alt"></i><span>Category</span>
                                </Link>
                                <ul className="mega">
                                    <li><Link to="/category" title="">All</Link></li>
                                </ul>
                            </li>

                            <li className="menu-item-has-children"> 
                                <Link title="">
                                <i className="fa fa-book"></i><span>Post</span>
                                </Link>
                                <ul className="mega">
                                    <li><Link to="/add-blog" title="">Add</Link></li>
                                    <li><Link to="/blogs" title="">View All</Link></li>
                                </ul>
                            </li>

                            <li className="menu-item-has-children"> 
                                <Link title="">
                                    <i className="fa fa-users"></i><span>Admin</span>
                                </Link>
                                <ul className="mega">
                                    <li><Link to="/add-admin" title="">Add</Link></li>
                                    <li><Link to="/admin" title="">View All</Link></li>
                                </ul>
                            </li>

                            <li className="menu-item-has-children"> 
                                <Link title="">
                                    <i className="fa fa-twitter"></i><span>Social Media Handles</span>
                                </Link>
                                <ul className="mega">
                                    <li><Link to="/socialmedia_handles" title="">All</Link></li>
                                </ul>
                            </li>

                            <li className="menu-item-has-children"> 
                                <Link title="">
                                    <i className="fa fa-info-circle"></i><span>Site Details</span>
                                </Link>
                                <ul className="mega">
                                    <li><Link to="/about_info" title="">About</Link></li>
                                    <li><Link to="/site_info" title="">Site info</Link></li>
                                </ul>
                            </li>

                            <li>
                                <Link to="/logout">
                                    <i className="fa fa-sign-out"></i><span>Logout</span>
                                </Link>
                            </li>
                            
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Sidebar