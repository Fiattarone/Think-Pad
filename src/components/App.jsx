import React, {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {

  const [notes, setNotes] = useState([]);
  
  function createNote(newNote) {
    setNotes((prevItems) => {
      return [...prevItems, newNote];
    })

  }

  function deleteItem(id) {
    setNotes((prevItems) => {
      return prevItems.filter((items, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={createNote}/>
      {/* {console.log(notes)} */}
      {notes.map((noteItem, index) => (
        <Note 
        key={index}
        id={index}
        title={noteItem.title}
        content={noteItem.content}
        onDelete={deleteItem}
        />
      ))}
      {/* <Note key={1} title="Note title" content="Note content" /> */}
      <Footer />
    </div>
  );
}

export default App;
