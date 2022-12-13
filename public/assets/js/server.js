const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const notes = require('../../../db/db.json');
//Using the crypto module to use the randomUUID method to generate a random ID string for each note.
const { randomUUID } = require('crypto');
const PORT = 3001;

//Middleware for automatic jason conversion, url encoded data, and static file serving.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('../../../public'));

//Route for front page/index.html.
app.get('/', (req, res)=>
    res.sendFile(path.join(__dirname, '../../../public/index.html'))
);
//Route for when the user clicks the 'Get Started' button.
app.get('/notes', (req, res)=>
    res.sendFile(path.join(__dirname, '../../../public/notes.html'))
);
//API route for fetching the saved notes within the database json file.
app.get('/api/notes', (req, res)=>{
    let data = fs.readFileSync('../../../db/db.json', 'utf-8');
    res.json(JSON.parse(data));
});
//API route for posting/saving a note to the database/db.json file. Uses the randomUUID() method to assign a randomly generated ID string to each note.
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if(title && text){
        const newNote = {
            title,
            text,
            note_id: randomUUID()
        };
        fs.readFile('../../../db/db.json', 'utf-8', (err, data)=>{
            if(err){
                console.log(err);
            }
            else{
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);
                fs.writeFile('../../../db/db.json', JSON.stringify(parsedNote, null, 4), (err)=> err ? console.error(err): console.info('Successfully updated notes.'));
                console.log(parsedNote);
            }
        })
        res.json(`Note Saved.`);
    }
    else{
        res.status(500).json('Error in posting note.')
    }


});
app.listen(PORT, ()=>
console.log (`Application listening at http://localhost:${PORT}`));
