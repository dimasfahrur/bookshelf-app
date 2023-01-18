const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateBookObject(id, bookTitle, bookAuthor, bookYear, isCompleted) {
  return {
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted,
  }
};

function generateID() {
  return +new Date();
}

document.addEventListener('DOMContentLoaded', function () {
  const inputBook = document.getElementById('inputBook');
  inputBook.addEventListener("submit", function(event) {
    event.preventDefault();
    addBook()
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  let isCompleted = document.getElementById('inputBookIsComplete');
  if (isCompleted.checked == true) {
    isCompleted = true;
  } else {
    isCompleted = false;
  }

  const generatedId = generateID();
  const bookObject = generateBookObject(generatedId, bookTitle, bookAuthor, bookYear, isCompleted, false);

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveChanges();
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
  incompleteBookshelf.innerHTML = '';

  const completeBookshelf = document.getElementById('completeBookshelfList');
  completeBookshelf.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem)
    if (!bookItem.isCompleted) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement)
    }
  }
});

function makeBook(bookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.bookTitle;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = "Penulis : " + bookObject.bookAuthor;

  const bookYear = document.createElement('p');
  bookYear.innerText = "Tahun : " + bookObject.bookYear;

  const bookContainer = document.createElement('article');
  bookContainer.classList.add('book_item');

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

    if (bookObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.innerText = "Belum Selesai";
      undoButton.addEventListener('click', function() {
        undoBookFromDone(bookObject.id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus';
      trashButton.addEventListener('click', function() {
        if (confirm('Apakah anda yakin ingin menghapus?') == true) {
          removeBookFromDone(bookObject.id);
          alert("Buku Berhasil Dihapus");
        } else {
          alert("Batal menghapus buku")
        }
      });
  
      buttonContainer.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = 'Selesai';
      checkButton.addEventListener('click', function() {
        addBookToDone(bookObject.id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus';
      trashButton.addEventListener('click', function() {
        if (confirm('Apakah anda yakin ingin menghapus?') == true) {
          removeBookFromDone(bookObject.id);
          alert("Buku Berhasil Dihapus");
        } else {
          alert("Batal menghapus buku")
        }
      });
  
      buttonContainer.append(checkButton, trashButton);

    bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);
    bookContainer.setAttribute('id', `book-${bookObject.id}`);
  }

  
  return bookContainer;
}

function addBookToDone(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveChanges();
}

function removeBookFromDone(bookId) { 
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveChanges();
}

function undoBookFromDone(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveChanges()
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  } 
  return true;
}

function saveChanges() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveChanges();
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const saveData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(saveData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {
  let input = document.getElementById('searchBookTitle').value;
  input = input.toLowerCase();
  let x = document.getElementsByTagName('h3');
  let y = document.getElementsByClassName('book_item');
    for (i = 0; i < x.length; i++) { 
      if (!x[i].innerHTML.toLowerCase().includes(input)) {
        y[i].style.display="none";
      }
      else {
      y[i].style.display="";                 
      }
    }
}

