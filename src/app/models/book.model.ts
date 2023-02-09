

export class BookModel {

  price: number;
  title: string;
  description: string;
  isbn: string;
  cover_image: File;
  author:any
  setBook(_book: unknown) {
    const book = _book as BookModel;
    this.price = book.price;
    this.title = book.title || '';

    this.description = book.description || '';
    this.isbn = book.isbn || '';
    this.cover_image = book.cover_image;

  }
}
