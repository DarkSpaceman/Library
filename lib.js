const express = require('express');
const {v4: uuid} = require('uuid');

class Library {
    constructor (id = uuid(), title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "") {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    };
};

class User {
    constructor (id=  uuid(), mail = "") {
        this.id = id;
        this.mail = mail;
    };
};

let store = { lib:[], users:[] };

const app = express();

app.use(express.json());



app.get('/api/books', (req, res) => {
    const { lib } = store;
    res.json(lib);
});


app.get('/api/books/:id', (req, res) => {
    const { lib } = store;
    const { id } = req.params;
    const idx = lib.findIndex(el => el.id === id);

    if ( idx !== -1 ) {
        res.json(lib[idx]);
    } else {
        res.status(404);
        res.json('404 | not found :(');
    };
});


app.post('/api/user/login', (req, res) => {
    const{ users } = store;
    const { mail } = req.body;

    const newUser = new User(uuid(), mail);
    users.push(newUser);

    res.status(201);
    res.json(newUser);
});


app.post('/api/books', (req, res) => {
    const { lib } = store;
    const {
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName } = req.body;

    const newBook = new Library(uuid(), title, description, authors, favorite, fileCover, fileName);
    lib.push(newBook);

    res.status(201);
    res.json(newBook);
});


app.put('/api/books/:id', (req, res) => {
    const { lib } = store;
    const { id } = req.params;

    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName } = req.body;

    const idx = lib.findIndex(el => el.id === id);
    if ( idx !== -1 ) {
        lib[idx] = {
            ...lib[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        };
        res.json(lib[idx]);
    } else {
        res.status(404);
        res.json('404 | not found :(');
    };
});


app.delete('/api/books/:id', (req, res) => {
    const { lib } = store;
    const { id } = req.params;

    const idx = lib.findIndex(el => el.id == id);

    if ( idx !== -1 ) {
        lib.splice(idx, 1);
    } else {
        res.status(404);
        res.json('404 | not found');
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log("Server started!!!") });