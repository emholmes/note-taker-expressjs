const fs = require("fs");
const path = require("path");

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const { notes } = require("./db/db.json"); 

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("public"));


app.get("/api/notes", (req, res) => {
  // let results = notes;
  res.json(notes);
});

const createNewNote = (body, notesArray) => {
  // console.log(body);
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
  req.body.id = notes.length.toString();
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

// Delete note
app.delete("/api/notes/:id", (req, res) => { 
  // let noteId = req.params.id;
  const noteObj = findNoteById(req.params.id, notes);
  console.log(noteObj);
  deleteNote(noteObj, notes);
  res.json(notes);
});

// app.get("/api/notes/:id", (req, res) => {
//   const result = findNoteById(req.params.id, notes);
//   if (result) {
//     console.log(result);
//     res.json(result);
//   } else {
//     res.send(404);
//   }
// });

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
