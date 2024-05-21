import React from 'react';
import './Leftmenu.css';

function Leftmenu() {
    return (
        <div className='menu'>
            <div className='header'>
                <h4>Menu</h4>
            </div>
            <div className='options'>
                <div className='homeoption'>
                    <div className='Homeicon'>
                        <i class="ri-home-4-fill"></i>
                    </div>
                    <div className='homeText'>
                        <h5>Home</h5>
                    </div>
                </div>
                <div className='exploreoption'>
                    <div className='exploreicon'>
                    <i class="ri-customer-service-fill"></i>
                    </div>
                    <div className='exploreText'>
                        <h5>Explore</h5>
                    </div>
                </div>
                <div className='libraryoption'>
                    <div className='libraryicon'>
                        <i class="ri-shadow-line"></i>
                    </div>
                    <div className='libraryText'>
                        <h5>Library</h5>
                    </div>
                </div>
                <div className='upgradeoption'>
                    <div className='upgradeicon'>
                        <i class="ri-shadow-line"></i>
                    </div>
                    <div className='upgradeText'>
                        <h5>upgrade</h5>
                    </div>
                </div>
            </div>
            <div className='lowerpart'>
                    <div className='newplaylist'>
                        <button className='newplaylistbutton'>
                            New playlist
                        </button>
                    </div>
                    <div className='likemusic'>
                        <h5>Liked music</h5>
                    </div>
            </div>
        </div>
    );
}

export default Leftmenu;
