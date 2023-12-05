import './App.css';
import Header from './components/Header/Header';
import AppRoutes from './AppRoutes';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import Sidebar from './components/Sidebar/Sidebar';
import AuthRoutes from './AuthRoutes';

function App() {
  
  const isAdminLoggedIn = Cookies.get('userAuthFashionBlogModerator');
  

  useEffect(() => {
    
  }, []);



  const headerComponent = isAdminLoggedIn ? <Header /> : null;
  const sidebarComponent = isAdminLoggedIn ? <Sidebar /> : null;
  const accessUserRoute = isAdminLoggedIn ? <AppRoutes /> : <AuthRoutes />;

  return (
    <div class="panel-layout">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div class="main-page">

              { sidebarComponent }
              
              { headerComponent }

              { accessUserRoute }

            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;
