import React, {useState} from "react";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {

  const [isExpanded, setIsExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  })

  function handleText(event) {
    const {name, value} = event.target;

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

  return (
    <div>
      <form className="create-note">
      { isExpanded && <input 
          onChange={handleText} 
          name="title" 
          placeholder="Title" 
          value={note.title}/> }
        
        <textarea 
          onClick={expand}
          onChange={handleText} 
          name="content" 
          placeholder="Take a note..." 
          rows={isExpanded ? 3 : 1} 
          value={note.content}/>
        <Zoom in={isExpanded}>
        <Fab onClick={(event) => {
          props.onAdd(note);
          event.preventDefault();
          setNote({title: "", content: ""});
        }}><AddCircleIcon/></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
