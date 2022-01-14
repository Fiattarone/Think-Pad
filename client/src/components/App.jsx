import React, {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";
import _ from "lodash";

var dontGet = false;

function App() {

  const [notes, setNotes] = useState([]);
  
  const [data, setData] = useState(null);

  // const [noteUpdating, setNoteUpdating] = useState({title: "", content: ""});

  // const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  function findNotes() {
    if (!dontGet) {
      // console.log(dontGet);
      axios
      .get("/note")
      .then((res) => 
        // console.log("Getting Notes: " + JSON.stringify(res)))
        setNotes((prevItems) => {
            return res.data;
        })
        
      )
      .catch(err => {
        console.error("Error was found: " + err)
        }, []);
    }
    dontGet = true;
    }   

  function createNote(newNote) {
    console.log("Note Passed: " + newNote.title);
    setNotes((prevItems) => {
      return [...prevItems, newNote];
    })
  }

  function deleteItem(id) {
    setNotes((prevItems) => {
      return prevItems.filter((items, index) => {
        if (index === id) {
          const noteTitle = _.startCase(items.title);
          // console.log(noteTitle);
          axios
            .delete(`/delete/${noteTitle}`)
            .then(() => {
            console.log("Note title passed!");
          })
          .catch(err => {
          console.error("Error was found: " + err)
          }, []);
        }
        return index !== id;
      });
    }); 
  }

  // function populateCA(id) {
  //   //Pull item to create area
  //   const noteUpdate = notes.find((note, index) => {
  //       return index === id;
  //   });

  //   console.log(noteUpdate); //This is the note, now we need to pass as prefilled to create area. 
  //   setNoteUpdating(noteUpdate);
  //   // setIsUpdating(true);

  
  // }

  return (
    <div>
      <div>
      <Header />
      {/* {console.log(isUpdating + " " + noteUpdating)} */}
      <CreateArea onAdd={createNote} />
      {/* <p>{!data ? "testing..." : data}</p> */}
      {findNotes()}
      {/* {console.log("These are the new notes" + notes)} */}
      {notes.map((noteItem, index) => (
        <Note 
        key={index}
        id={index}
        title={noteItem.title}
        content={noteItem.content}
        priority={noteItem.priority}
        progress={noteItem.progress}
        date={noteItem.date}
        onDelete={deleteItem}
        // onUpdate={populateCA}
        />
      ))}
      {/* {setIsUpdating(false)}; */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
