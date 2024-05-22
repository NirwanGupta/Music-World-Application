import React, { useState } from "react";
import Navbar from "./Navbar";
import Leftmenu from "./Leftmenu";
import ToggledMenu from "./ToggledMenu";
import Artistsall from "./Artistsall";
import "./Full.css";

const Full = () => {
  // Start with ToggledMenu visible
  const [menuStage, setMenuStage] = useState(0); 

  const toggleMenu = () => {
    // Toggle between 0 and 1
    setMenuStage(prevStage => (prevStage + 1) % 2);
  };

  return (
    <div className="app-container">
      <Navbar toggleMenu={toggleMenu} />
      <div className="downintrection">
        <div className="menuforuser">
          <div className={menuStage === 0 ? "menu-active" : "menu-exit"}>
            <ToggledMenu />
          </div>
          <div className={menuStage === 1 ? "menu-active" : "menu-exit"}>
            <Leftmenu />
          </div>
        </div>
        <div className="rightintrectionforuser">
          <Artistsall />
        </div>
      </div>
    </div>
  );
};

export default Full;
