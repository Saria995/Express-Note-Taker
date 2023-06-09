//Require the packages
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


//creating the express() app
const app = express();
const PORT = process.env.PORT || 3001;

//Setting up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//Setting up routes for the API
//Get all notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));
  res.json(notes);
});
//Add new note
app.post('/api/notes', (req, res) => {
    const newNote = { id: uuidv4(), ...req.body };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(newNote);
        console.log("Note saved successfully");
      });
    });
  });
  //Delete Note
  app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const filteredNotes = notes.filter((note) => note.id !== id);
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
            if (err) throw err;
            res.json({ message: `Note ${id} deleted successfully.`});
            console.log( `Note ${id} deleted successfully.`);
        });
    });
  });

//Setting up a route to serve the HTML file
app.get('/notes', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'notes.html');
  res.sendFile(filePath);
  //res.sendFile(path.join(__dirname, '/notes.html'));
  });
// Setting up a catch-all route to serve the index.html file
  app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
// Starting the server
  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
  );