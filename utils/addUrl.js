const addUrl = (obj) => {
    const books = JSON.parse(JSON.stringify(obj));
    const urlChapters = 'https://app-book-api.herokuapp.com/books/';
    const urlCloudinaryImg = 'https://res.cloudinary.com/dxdejv8nr/image/upload/v1659577029/';

    books.forEach((element) => {

        element.img = `${urlCloudinaryImg}${element.img}`;

        element.chapters.map((data) => {

            data.url = `${urlChapters}${element.name}/${data.id}`;
            
        });
    });


    return books;
}

export default addUrl;