import React from 'react';
import './ToggledMenu.css';

function ToggledMenu() {
    return (
        <div className='menutoggledmenu'>
            
            <div className='optionstoggledmenu'>
                <div className='homeoptiontoggledmenu'>
                    <div className='Homeicontoggledmenu'>
                        <i class="ri-home-4-fill"></i>
                    </div>
                </div>
                <div className='exploreoptiontoggledmenu'>
                    <div className='exploreicontoggledmenu'>
                        <i class="ri-customer-service-fill"></i>
                    </div>
                   
                </div>
                <div className='libraryoptiontoggledmenu'>
                    <div className='libraryicontoggledmenu'>
                        <i class="ri-shadow-line"></i>
                    </div>
                </div>
                <div className='upgradeoptiontoggledmenu'>
                    <div className='upgradeicontoggledmenu'>
                        <i class="ri-shadow-line"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToggledMenu;
