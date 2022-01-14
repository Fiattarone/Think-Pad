import React from "react";
import EmojiObject from '@material-ui/icons/EmojiObjects';
import LogoutIcon from '@material-ui/icons/MeetingRoom';
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

function Header() {
  return (
    
    <header>
    <div className="flex-container">
    <h1 className="flex-child"><EmojiObject fontSize="medium"/>Think-Pad Notes</h1>
    <div className="flex-child logoutB"><a href="/logout"><Fab className="logout" ><LogoutIcon fontSize="large"/></Fab></a></div> 
    </div>
  </header>
    
  );
}

export default Header;
