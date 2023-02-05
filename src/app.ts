interface Book {
    id:          string;
    title:       string;
    description: string;
    authors:     string;
    favorite:    string;
    fileCover:   string;
    fileName:    string;
    fileBook:    string;
}
let lib: any[] = [];

const book: Book = {
    id: '',
    title: 'Physics of impossible',
    description: '',
    authors: 'Micio Kaku',
    favorite: '',
    fileCover: '',
    fileName: '',
    fileBook: ''
}


class BookRepository {
    createBook( book: Book ): void {
        lib.push(book);
    }

    getBook( id: string ): any {
        const idx = lib.findIndex( el => el.id === id );

        if ( idx !== -1 ) {
            return lib[ idx ];
        }
    } 

    getBooks(): any {
        return lib;
    }

    updateBook( id: string, book: Book ) {
        const idx = lib.findIndex( el => el.id === id );

        if ( idx !== -1 ) {
            lib[ idx ] = {
                ...lib[ idx ],
                title:       book.title,
                description: book.description,
                authors:     book.authors,
                favorite:    book.favorite,
                fileCover:   book.fileCover,
                fileName:    book.fileName,
                fileBook:    book.fileBook,
            }
            return lib[ idx ];
        }
    }

    deleteBook( id: string ) {
        const idx = lib.findIndex( el => el.id === id );

        if ( idx !== -1 ) {
            lib.slice( idx, 1 );
        }
    }
}