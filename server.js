const fs = require("fs");
const path = require("path");

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const {v4 : uuidv4} = require('uuid');

const { notes } = require("./db/db.json"); 

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("public"));


app.get("/api/notes", (req, res) => {
  res.json(notes);
});

const createNewNote = (body, notesArray) => {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return body;
}

app.post("/api/notes", (req, res) => {
  // set id based on the next index of the array
  let uniqueId = uuidv4();
  req.body.id = uniqueId;
  const note = createNewNote(req.body, notes);
  res.json(note);
});

const findNoteById = (id, notesArray) => {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

const deleteNote = (noteObj, notesArray) => {
  let index = notesArray.indexOf(noteObj);
  notesArray.splice(index, 1);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return notesArray;
}

// Delete request
app.delete("/api/notes/:id", (req, res) => { 
  const noteObj = findNoteById(req.params.id, notes);
  deleteNote(noteObj, notes);
  res.json(notes);
});

// HTML Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is now on port ${PORT}`);
});
