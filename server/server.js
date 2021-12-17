const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const _ = require("lodash");
const e = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors({
  origin: "/",
  credentials: true
}))

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/noteDB");

const noteSchema = new mongoose.Schema({
  title: String, 
  content: String, 
  date: String, 
  priority: String,
  progress: Number
});

const Notebook = mongoose.model("Notebook", noteSchema);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/note", async (req, res) => {
  //load prior notes 
  Notebook.find({}, (err, notes) => {
    if (!err) {
      // console.log("These are all the notes." + notes);
      res.json(notes);
    } else {
      console.log("error: " + err);
    }
  
  })
})

app.post("/", async (req, res) => {
  // console.log("Post making." + req.query);
  // console.log("Post Title." + req.body.title);
  // console.log("Post content." + req.body.content);
  // console.log("Post making." + req.body);

  const newNote = new Notebook({
    title: _.startCase(req.body.title),
    content: req.body.content, 
    date: req.body.date, 
    priority: req.body.priority, 
    progress: req.body.progess
  });

  try {
    const note = newNote.save();
    if (!note) {
      throw Error("Could not save note.");
      }
    // console.log("Post Made.");
    res.status(200).json(note);
    } catch (err) {
      res.sendStatus(400).json(note);
    }
});

app.put("/update/:noteTitle", async (req, res) => {
  await Notebook.updateOne({title: _.startCase(req.params.noteTitle)}, {title: _.startCase(req.body.title), content: req.body.content}, (err) => {
    if (!err) {
      console.log("Update complete for (old): " + req.params.noteTitle + " and for (new): " + req.body.title + " " + req.body.content);
    } else {
      console.log("Error: " + err);
    }
  })
})

app.delete("/delete/:specificNote", (req, res) => {
  // console.log("In the delete " + req.params.specificNote);
  try {
     Notebook.deleteOne({title: req.params.specificNote}, err => {
      if (!err) {
        res.status(200).json({success: true});
      } else {
        throw Error("Something went wrong while trying to delete the item.");
      }
    })
  } catch (err) {
    res.status(400).json({msg: err.message, success: false})
  }
 
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});