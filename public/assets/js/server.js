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
            id: randomUUID()
        };
        fs.readFile('../../../db/db.json', 'utf-8', (err, data)=>{
            if(err){
                console.log(err);
            }
            else{
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                fs.writeFile('../../../db/db.json', JSON.stringify(parsedNotes, null, 4), (err)=> err ? console.error(err): console.info('Successfully updated notes.'));
            }
        })
        res.json(`Note Saved.`);
    }
    else{
        res.status(500).json('Error in posting note.')
    }


});
//API delete route to handle delete requests. By running the filter method on the parsed DB data, a new array is created with only the undeleted notes.
app.delete('/api/notes/:id', (req, res)=>{
    fs.readFile('../../../db/db.json', 'utf-8', (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            const parsedNotes = JSON.parse(data);
            const undeletedNotes = parsedNotes.filter(function(note){
                return note.id !== req.params.id;
            })
            fs.writeFile('../../../db/db.json', JSON.stringify(undeletedNotes, null, 4), (err)=> err ? console.error(err): console.info('Successfully deleted note.'));
        }
    })
    //This will redirect to the origial url path of /notes, essentially like refreshing the page so that the notes list will render with the deleted note no longer present.
    res.redirect('');
})

app.listen(PORT, ()=>
console.log (`Application listening at http://localhost:${PORT}`));
