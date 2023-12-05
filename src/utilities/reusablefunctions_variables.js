import CryptoJS from 'crypto-js';


function clearCookies() {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

export function logout(){
  localStorage.clear();
  clearCookies();
  setTimeout(()=>{
    // navigate('/login');
    window.location.replace('/login');
  },500)
}

export function decodeHTMLEntities(html) {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.textContent || element.innerText;
}


export function formatNumberWithCommas(number) {
    if(number){
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return null;
}

export const adminTypeMap = {
    '0': 'Super Admin',
    '1': 'Admin',
    '2': 'Sub admin'
};

export function addEllipses(text, limit) {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
}

export const encryptData = (data, secretKey) => {
    return CryptoJS.AES.encrypt(data.toString(), secretKey).toString();
}

// Decrypt Data
export const decryptData = (data, secretKey) => {
    const thedata = data.replace(/ /g, '+'); // Replace spaces with +
    const decrypted = CryptoJS.AES.decrypt(thedata, secretKey);
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

    // console.log('Decrypted Data:', decryptedData);
    return decryptedData;
}

// Format Date
export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
  
    const amOrPm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12; // Handle midnight (0 hours)
  
    // Add leading zeros to minutes if needed
    minutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${day} ${month} ${year}, ${hours}:${minutes} ${amOrPm}`;
};

export function todayDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}

export function convertDateFormatToyyyy_mm_dd(dateString) {
  // date format from 23-08-2021 to 2021-08-23
  // Check if the date string is in the format 'dd-mm-yyyy'
  const isDdMmYyyyFormat = /\d{2}-\d{2}-\d{4}/.test(dateString);

  if (isDdMmYyyyFormat) {
    const parts = dateString.split('-');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  // If the date string is already in the 'yyyy-mm-dd' format, return as is
  return dateString;
}

export function getCurrentPayFormattedMondayDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 1 - dayOfWeek;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() + daysUntilMonday);

  const mondayFormattedDate = `${mondayDate.getDate().toString().padStart(2, '0')}-${(mondayDate.getMonth() + 1).toString().padStart(2, '0')}-${mondayDate.getFullYear()}`;
  const mondayFormattedMonthYear = `${mondayDate.getDate().toString().padStart(2, '0')} ${mondayDate.toLocaleString('en-us', { month: 'short' })} ${mondayDate.getFullYear()}`;

  return { mondayFormattedDate, mondayFormattedMonthYear };
}

// Loader
export const Loader = () => (
    <div className="loader">
      <p>Loading Data...</p>
    </div>
);

// Pagination
export const replaceQuotationMarks = (label) => {
    return label.replace(/&raquo;/g, '»').replace(/&laquo;/g, '«');
};

// Capitalize Each Word
export const capitalizeEveryWord =(sentence)=> {
    if (!sentence) return ''; // Handle empty input
  
    const words = sentence.split(' ');
  
    const capitalizedWords = words.map((word) => {
      // Capitalize the first letter and append the rest of the word
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  
    return capitalizedWords.join(' ');
  }