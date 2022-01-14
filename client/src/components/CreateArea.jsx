import React, {useState} from "react";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import axios from "axios";
import _ from "lodash"; 
// import { Rating } from "react-simple-star-rating";
import StarPriority from "./StarPriority";

function CreateArea(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [newPriority, setNewPriority] = useState(0);

  const [note, setNote] = useState({
    title: "",
    content: "",
    priority: "",
    progress: ""
  })

  function handleText(event) {
    const {name, value} = event.target;
    console.log(`Name was: ${name} value was: ${value}`);
    // if (name === "title") {
    //   setNote({title: value, content: note.content});
    // } else if (name === "content") {
    //   setNote({title: note.title, content: value})
    // }

    setNote((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    });
  }

  function expand() {
    setIsExpanded(true);
  }

  function handlePriority(newPriority) {
    // if (!newPriority) {
    //   newPriority = 1;
    // }
    // console.log("newPriority has been changed to: " + newPriority);
    
    setNote((prevValue) => {
      // console.log("newPriority is: " + newPriority);
      // if (!newPriority) {
      //   newPriority = 0;
      // }
      // console.log("newPriority has been changed to: " + newPriority);
      return {
        ...prevValue,
        priority: newPriority
      }
    });
  }
  
  function handleForm(e) {
    e.preventDefault();
    console.log(note.title)
      const tempTitle = _.startCase(note.title);
      console.log(tempTitle);
      setNote({
        title: tempTitle,
        content: note.content,
        priority: note.priority,
        progress: note.progress
      });
      // console.log("The note title is: " + note.title + "While the temptile remains: " + tempTitle);
      props.onAdd(note);
      setNote({title: "", content: "", priority: "", progress: ""});
  
      axios
        .post("/", note)
        .then(() => console.log("Note passed."))
        .catch(err => {
          console.error(err);
        });
  }

  // function handlePriority(event) {
  //   const {name, value} = event.target;

  // }

  // function checkTitle() {
  //   if (props.updateTitle !== "") {
  //     refT.current.value = props.updateTitle;
  //   } else {
  //     refT.current.value = note.title;
  //   }
  //   return refT;
  // }

  // function checkContent() {
  //   if (props.updateContent !== "") {
  //     refC.current.value = props.updateContent;
  //   } else {
  //     refC.current.value = note.content;
  //   }
  //   return refC;
  // }
  

  return (
    <div>
      {/* {props.update && setNote(props.update)} */}
      {/* {console.log("The update was: " + props.updateTitle + " And the new Note is: " + props.updateContent)} */}

      <form 
        className="create-note"
        action="/"
        method="post"
        onSubmit={handleForm}
        >
        
      { isExpanded && <div>
        <input 
          onChange={handleText} 
          name="title" 
          placeholder="Title"
          value={note.title}
          required
          autoComplete="off"
          /> 
          {/* <input 
            onChange={handleText}
            name="priority" 
            placeholder="Priority (0 - 10)"
            value={!note.priority ? "" : note.priority}
            type="number"
            autoComplete="off"
            min="0"
            max="10"
          /> */}
            <StarPriority 
              className="starPriority"
              onAdd={handlePriority}
              isCurrentlyEditable={true}
              onCreate={true}
              // fedPriority={newPriority}
            />
            
          <input 
            onChange={handleText}
            name="progress" 
            placeholder="Progress (0 - 100)"
            value={!note.progress ? "" : note.progress}
            type="number"
            autoComplete="off"
            min="0"
            max="100"
          /></div>}
        {/* {console.log(note.progress)} */}
        <textarea 
          onClick={expand}
          onChange={handleText} 
          name="content" 
          placeholder="Take a note..." 
          rows={isExpanded ? 3 : 1} 
          value={note.content}
          autoComplete="off"
          />
        <Zoom in={isExpanded}>
        <Fab 
        className="formAddButton"
        type="submit" ><AddCircleIcon/></Fab>
        </Zoom>
  
      </form>
    </div>
  );
}

export default CreateArea;
