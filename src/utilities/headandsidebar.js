// utility.js
export function setupCommonFunctionality() {

    document.querySelector('.nav-icon3').addEventListener('click', function () {
        //    alert("utility");

        document.querySelector('.nav-icon3').classList.toggle('open');

        // document.querySelector('.menu-options').classList.toggle('active');
        document.querySelector('.side-header').classList.toggle('slide-out');
        // document.querySelector('a.closed').classList.remove('slide-out');
        document.querySelector('.main-content').classList.toggle('menu-slide');
      });

    document.addEventListener('DOMContentLoaded', () => {
      const navIcon3 = document.querySelector('.nav-icon3');
      const moreOption = document.querySelector('.more-option');
      const menuOptions = document.querySelector('.menu-options');
      const sideHeader = document.querySelector('.side-header');
      const closedLink = document.querySelector('a.closed');
      const mainContent = document.querySelector('.main-content');
      const moreOptn = document.querySelector('.more-optn');
  
      if (navIcon3) {
        navIcon3.addEventListener('click', () => {
            // alert("rfr");
          navIcon3.classList.toggle('open');
          menuOptions.classList.toggle('active');
          sideHeader.classList.toggle('slide-out');
          closedLink.classList.remove('slide-out');
          mainContent.classList.toggle('menu-slide');
        });
      }
  
      if (moreOption) {
        moreOption.addEventListener('click', () => {
          moreOptn.classList.toggle('show');
        });
      }
    });
  }