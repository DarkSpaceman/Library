const fileMulter = require('../middleware/file');
const { Router } = require('express');
const router = Router();

router.post('/books/upload',
            fileMulter.single('book'),
            ( req, res, next ) => {
                if ( req.file ) {
                    const { path } = req.file;
                    res.json({path});
                }
                res.json();
});

module.exports = router;