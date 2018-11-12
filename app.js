class Book {
	constructor(title, author, isbn) {
		this.title = title
		this.author = author
		this.isbn = isbn
	}
}

class UI {
	// Add Book to List
	addBookToList(book){
        const list = document.getElementById('book-list')
        // create tr element
        const row = document.createElement('tr')
        
        // insert col
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#"><i class="hapus fa fa-remove"></i></a></td>
        `
        list.appendChild(row)
	}
	
	// show alert
	showAlert(message, className){
        // create div
        const div = document.createElement('div')
        // add class
        div.className = `alert ${className}`
        // add text
        div.appendChild(document.createTextNode(message))
        // get parent
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        // insert alert
        container.insertBefore(div, form)

        // timeout 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove()
        }, 3000)
	}

	// Delete Book
	deleteBook(target){
		if (target.classList.contains('hapus')) {
				target.parentElement.parentElement.parentElement.remove()
		}
	}

	// Clear field
	clearField(){
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('isbn').value = ''
	}
}

// Local Storage Class
class Store {
    static getBooks(){
        let books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }

    static displayBooks(){
        const books = Store.getBooks()

        books.forEach(book => {
            const ui = new UI()

            ui.addBookToList(book)
        });
    }

    static addBook(book){
        const books = Store.getBooks()

        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn){
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks)

// Event Listener for Add Book
document.getElementById('book-form').addEventListener('submit', function(e){
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value

    // instantiate the book
    const book = new Book(title, author, isbn)

    // instantiate the UI
    const ui = new UI()

    // validate
    if (title === '' || author === '' || isbn === '') {
        // show error alert
        ui.showAlert('Please fill in all fields !!!', 'error')
    } else {
        // add book to list
        ui.addBookToList(book)

        // add to Local Storage
        Store.addBook(book)

        // show sucess alert
        ui.showAlert('Book Added !!', 'success')
        // clear field
        ui.clearField()
    }

    console.log(ui)

    e.preventDefault()    
})

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function(e){
    const ui = new UI()
    ui.deleteBook(e.target)

    // Remove from Local Storage
    Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent)

    // show alert
    ui.showAlert('Book Removed!', 'success')

    e.preventDefault()
})