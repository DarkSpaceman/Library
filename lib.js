const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('./middleware/logger');
const err_404 = require('./middleware/error404');
const bookRouter = require('./routes/upload');
const app = express();


app.use('/public', express.static(__dirname + '/public'))
app.use(logger);
app.use(express.json());
app.use('/api', bookRouter);


class Library {
    constructor (id = "", title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook="") {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    };
};

class User {
    constructor (id = "", mail = "") {
        this.id = id;
        this.mail = mail;
    };
};

let store = { lib:[], users:[] };



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
    }
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
            fileName,
            fileBook } = req.body;

    const newBook = new Library(uuid(), title, description, authors, favorite, fileCover, fileName, fileBook);
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


app.use(err_404);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log("Server started!!!") });