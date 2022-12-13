const express = require('express');
const app = express();
const path = require('path');
const PORT = 3001;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('../../../public'));

app.get('/', (req, res)=>
    res.sendFile(path.join(__dirname, '../../../public/index.html'))
);
app.get('/notes', (req, res)=>
    res.sendFile(path.join(__dirname, '../../../public/notes.html'))
);
// app.get('/api/notes', (req, res)=>
//     res.    
// );
app.listen(PORT, ()=>
console.log (`Application listening at http://localhost:${PORT}`));
