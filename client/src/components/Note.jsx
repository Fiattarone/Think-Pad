import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import axios from "axios";
import StarPriority from "./StarPriority";

function Note(props) {
  
  const [isEditable, setIsEditable] = useState(false);

  const [h1pIDs, setH1PIDS] = useState(["", "", "", ""]);

  const [dontGet, setDontGet] = useState(false);

  const [percentage, setPercentage] = useState(0);

  const [starEdit, setStarEdit] = useState(0);


  function makeEditable() {
    setIsEditable(true);
  }

  function setEdit(newStars) {
    console.log(`Old stars: ${starEdit} and New Stars: ${newStars}`);
    setStarEdit(newStars);
  }
  
  function handleUpdateAddition() {

    setIsEditable(false);

    let handedPercentageValue;
    if (document.getElementById(h1pIDs[3]).value) {
      handedPercentageValue = document.getElementById(h1pIDs[3]).value;
      console.log("This is the handed percentage value: " + handedPercentageValue);
    if (handedPercentageValue > 100) {
      handedPercentageValue = 100;
    } else if (handedPercentageValue < 0) {
      handedPercentageValue = 0;
    }
    setPercentage(handedPercentageValue);
    } else {
      handedPercentageValue = percentage;
    }

    const newNote = {
      title: document.getElementById(h1pIDs[0]).innerText, 
      content: document.getElementById(h1pIDs[1]).innerText,
      priority: starEdit,
      progress: handedPercentageValue
    }

    axios
    .put(`/update/:${props.title}`, newNote)
    .then(() => {
      console.log("This is the Note Title: " + props.title); 
    })
    .catch(err => {
      console.error("Error was found: " + err);
      }, []);
      // window.location.reload();
  }

  function getIDs() {
    const h1TempString = "h1" + props.id.toString();
    const pTempString = "p" + props.id.toString();
    const priorityTempString = "priority" + props.id.toString();
    const progressTempString = "progress" + props.id.toString();
    setH1PIDS([h1TempString, pTempString, priorityTempString, progressTempString]);
    setDontGet(true);
    
    setPercentage(props.progress);
  }

  return (
    <div className="note">
      {!dontGet && getIDs()}
      <h1 id={h1pIDs[0]} contentEditable={isEditable} suppressContentEditableWarning={true}>{props.title}</h1>
      <p id={h1pIDs[1]} contentEditable={isEditable} suppressContentEditableWarning={true}>{props.content}</p>
      
      {/* Is editable--Needs to refresh itself upon completion via changing the useState */}
      <StarPriority 
        id={h1pIDs[2]} 
        fedPriority={isEditable ? starEdit : props.priority} // changing from just props.priority
        isCurrentlyEditable={isEditable}
        onAdd={setEdit}
        // onCreate={false}
      />

      <div className="progress">
        <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{width: (percentage.toString()+"%")}} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">{!props.progress ? "" : percentage}</div>
      </div> 
      {isEditable && <input className="inputProgress" id={h1pIDs[3]} type="number" min="0" max="100" placeholder="Set New Progress" />}

{/* Added .updateDelete subclass to button  */}
      <p className="timeStamp">{props.date}</p>
      <button className="updateDelete" onClick={() => {props.onDelete(props.id)}}><DeleteIcon /></button>
      {isEditable ? <Zoom in={isEditable}><Fab className="updateDelete" type="submit" onClick={handleUpdateAddition} ><AddCircleIcon/></Fab></Zoom> :  <button className="updateDelete" onClick={makeEditable}><UpdateIcon /></button>}
    </div>
  );
}

export default Note;
