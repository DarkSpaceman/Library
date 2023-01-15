const { Router } = require('express');
const { v4: uuid } = require('uuid');
const fileMulter = require('../middleware/file');
const redis = require('redis');
const router = Router();

const REDIS_URL = process.env.REDIS_URL || "redis://localhost";

const client = redis.createClient({ url: REDIS_URL });
(async () => {
    await client.connect();
})();

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

router.get('/api/books/create', ( req, res ) => {
    res.render('create', { title: 'New book'})
})

router.get('/api/books', ( req, res ) => {
    const { lib } = store;
    res.render('index', {
        title: 'Все книги',
        libr: lib
    })
});


router.get('/api/books/:id', async ( req, res ) => {
    const { lib } = store;
    const { id } = req.params;
    const idx = lib.findIndex( el => el.id === id );

    let cnt = '';

    try {
        const cnt = await client.incr(id);
        res.json({ message: `${id} ${cnt}` });
    } catch (err) {
        res.status(500);
    }

    if ( idx !== -1 ) {
        res.render('view', {
            el: lib[ idx ],
            views: cnt,
        });
    };
});


router.get('/api/books/:id/download', ( req, res ) => {
    const { lib } = store;
    const { id } = req.params;

    const idx = lib.findIndex( el => el.id === id );

    if ( idx !== -1 ) {
        let book = String(lib[idx].fileBook);
        res.download(book, ( err ) => { if ( err ) throw err });
    }
});

router.get('/api/books/:id/update', ( req, res ) => {
    const { lib } = store;
    const { id } = req.params;
    const idx = lib.findIndex( el => el.id === id );

    if ( idx !== -1 ) {
        res.render('update', {
            el: lib[ idx ],
            title: 'Updating book.'
        });
    };
});


router.post('/api/user/login', ( req, res ) => {
    const{ users } = store;
    const { mail } = req.body;

    const newUser = new User(uuid(), mail);
    users.push(newUser);

    res.status(201);
    res.json(newUser);
});



router.post('/api/books/create', fileMulter.single('book'), ( req, res ) => {
    const { lib } = store;

    const {
            title,
            desc,
            authors,
            favorite,
            fileCover,
            fileName,
            } = req.body;

    let book = ''

    if(req.file) {
        const { path } = req.file;
        book = path;
    }
    const newBook = new Library(uuid(), title, desc, authors, favorite, fileCover, fileName, book);
    lib.push(newBook);

    res.status(201);
    res.json(newBook)
});


router.put('/api/books/:id/update', fileMulter.single('book'), ( req, res ) => {
    const { lib } = store;
    const { id } = req.params;

    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName } = req.body;


    let fileBook = '';

    if ( req.file ) {
        const { path } = req.file;
        fileBook = path;
    }

    const idx = lib.findIndex(el => el.id === id);
    if ( idx !== -1 ) {
        lib[idx] = {
            ...lib[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        };
        res.json(lib[idx]);
    } else {
        res.status(404);
        res.json('404 | not found :(');
    };
});


router.delete('/api/books/:id', ( req, res  ) => {
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


module.exports = router;