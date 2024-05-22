import React from 'react';
import './navbar.css';

function Navbar({ toggleMenu }) {
    return (
        <div className='navbar'>
            <div className='leftnav'>
                <div className='menunav'>
                <button onClick={toggleMenu} className="menu-icon">
                    <i className="ri-menu-line"></i> {/* Ensure the icon class is correct */}
                </button>
                
                </div>
                <div className='logo'>
                    <img className='logonav' src="https://toppng.com/uploads/preview/music-notes-symbols-png-115522465817z635gmcj0.png" alt="logo" />
                </div>
                <div className='namenav'>
                    <h3>Music World</h3>
                </div>
            </div>
            <div className='centernav'>
                <form>
                    <div className='formsearch'>
                        {/* The search input that will be hidden on small screens */}
                        <input type="text" className='search' placeholder='Search songs, Album, Artists ...' />
                        {/* The search icon that will be shown on small screens */}
                    </div>
                    <div className='searchinform'>
                    <i className="ri-search-line search-icon"></i>
                    </div>
                </form>
            </div>
            <div className='rightnav'>
                <div className='optionsIcon'>
                    <i className="ri-more-2-fill"></i>
                </div>
                <div className='SignUpcontainer'>
                    <button className='SignUpBtn'> SignUp? </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
