import Books from '../models/Books.js';
import addUrl from '../utils/addUrl.js';
import StatusCodes from 'http-status-codes';

// Crear
const addBook = async (req, res, next) => {

    const { _id: createBy } = req.user;
    const book = req.body;

    book.createBy = createBy;
    
    try {

        await Books.create(book);
        return res.status(StatusCodes.CREATED).json({"mensaje": `Se guardo el book Exitosamente`});
    }catch(err) {
        if(err.code === 11000) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'El nombre ya Existe'});
        }else {
            console.log(err);
        }   
    }
};

// Mostrar
const viewBook = async (req,res) => {

    // console.log('--- Start Paginación ---');
    // Paginación
    let offset = Number(req.query.offset) || 0;
    let limit = Number(req.query.limit) || 1;

    // Control de valor Negativo en offset
    if(!(0 <= offset)) {
        // offset Default
        offset = 0;
    }

    // Promesa donde se obtiene 
    // books = La consuta de los documents de la tabla books
    // count = La cantidad total de los documents
    let [ books, count ] = await Promise.all([
        Books.find({}, {"_id": 0, "__v": 0, "chapters.text": 0})
        .skip(offset).limit(limit),
        Books.countDocuments()
    ]);


    // Control de paginacion
    const urlBase = 'http://localhost:3000/books/';
    let urlNext, urlPrev, offsetNext, offsetPrev;

    // Next
    // -----------------------------------------------------------------
    // Si offset es mayor a la cantidad de documents sera NULL
    if(offset > count) {
        urlNext = null;
    }else {
        let sumNext = (count-offset) - limit;
        let itemNext = count - offset;
        let intemPrev = count - itemNext;

        // Todo el recorrido P<-- -->N
        if((itemNext-limit) >= limit) {
            offsetNext = offset + limit;
            urlNext = `${urlBase}?offset=${offsetNext}&limit=${limit}`;
            
            // El Inicio Previos P<--
            if(offset != 0){
                if(intemPrev <= limit) {
                    offsetPrev = offset - intemPrev;
                    urlPrev = `${urlBase}?offset=${offsetPrev}&limit=${intemPrev}`;
                }else {
                    offsetPrev = offset - limit;
                    urlPrev = `${urlBase}?offset=${offsetPrev}&limit=${limit}`;
                }
            }else {
                urlPrev = null;
            }

        }else {
            // Al final del Next -->N
            if(sumNext != 0) {
                offsetNext = offset + limit;
                let limitNext = itemNext - limit;
                urlNext = `${urlBase}?offset=${offsetNext}&limit=${limitNext}`;
                
                offsetPrev = offset - intemPrev;
                urlPrev = `${urlBase}?offset=${offsetPrev}&limit=${intemPrev}`;

            }else {
                urlNext = null;

                offsetPrev = offset - limit;
                urlPrev = `${urlBase}?offset=${offsetPrev}&limit=${limit}`;
            }
        }
    }

    const result = addUrl(books);

    res.status(StatusCodes.OK).json({
        "status": "ok",
        "count": count,
        "next": urlNext,
        "previous": urlPrev,
        result
    });

};

const viewBookIdText = async (req, res) => {

    // console.log(req.params);
    const { name, id } = req.params;
    const idN = Number(id);

    try{

        const texto = await Books.aggregate([
            {$unwind: "$chapters"},
            {$match: {name: name, "chapters.id": idN}},
            {"$replaceRoot": {"newRoot": "$chapters"}},
            {$project: {id: 0, title: 0}}
        ]);

        return res.status(StatusCodes.OK).json(texto);
    }catch(err) {
        console.log(err);
    }
}

const updateBook = async (req, res) => {

    const { id } = req.params;
    const { id:idCap, title, text } = req.body;

    try{

        const response = await Books.updateOne({_id:id, 'chapters.id': idCap}, 
        { $set: 
            {
                'chapters.$[cap].title': title,
                'chapters.$[cap].text': text
            }
        }, {arrayFilters: [{'cap.id': idCap}]})

        if(response.matchedCount === 1) {
            return res.status(StatusCodes.OK).json({"msg": "Actualizado correctamente"});
        }else {
            return res.status(StatusCodes.BAD_REQUEST).json({"msg": "No se Actulizo Registro"});
        }


    }catch(err) {
        console.log(err);
    }
}

const deleteBook = async (req, res) => {

    const { id } = req.params;

    try {

        const resp = await Books.findById(id);
        
        if(!resp){
            res.status(StatusCodes.NOT_FOUND).json({msg: 'Not Found'});
            return;
        }
        
        await Books.findByIdAndDelete(id);
        res.status(StatusCodes.OK).json({msg: 'Se elimino Books'});
        return;

    }catch(err) {
        console.log(err);
    }
}



export { viewBook, viewBookIdText , addBook, updateBook, deleteBook };