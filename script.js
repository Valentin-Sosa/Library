const addBookBtn = document.getElementById("add-book");
const form = document.querySelector("form");
const errors = document.getElementsByClassName("error");
const author = document.getElementById("author");
const title = document.getElementById("title");
const pages = document.getElementById("pages");
const read = document.getElementById("read");
const modal = document.querySelector("dialog");
const bookFile = document.getElementById("book-file");
const bookFileLabel = document.querySelector("label[for=book-file] > span")
const submitBtn = document.getElementById("add");
const library = document.getElementById("library");
let myLibrary = [];

addBookBtn.addEventListener("click", () =>{
  resetValidation();
  form.reset();
  modal.showModal()
});
title.addEventListener("input", () => checkInputValidation(title));
author.addEventListener("input", () => checkInputValidation(author));
pages.addEventListener("input", () => checkInputValidation(pages));
bookFile.addEventListener("input", ()=> showFileName());
form.addEventListener("submit", event => checkAllInputsValidation(event));
library.addEventListener("click", e =>{
  if(e.target.textContent === "Remove") removeBook(myLibrary[e.target.dataset.indexNumber]);
  else if(e.target.textContent === "Read" || e.target.textContent === "Not read yet") changeReadStatus(e);
  else if(e.target.textContent === "Open book file") openFileBook(myLibrary[e.target.dataset.indexNumber]);
})

function Book(author,title, numberOfPages, read, file) 
{
  this.author = author;
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.read = read;
  this.fileBook = file;
}

function addBookToLibrary() 
{
  const newBook = new Book(author.value,title.value,pages.value,read.checked, bookFile.files[0]);
  myLibrary.push(newBook);
  modal.close();
  showCardBook(newBook);
}

function showCardBook(book)
{
  const bookSection = document.createElement("section");
  const titleSection = document.createElement("section");
  titleSection.id = "titleBook";
  const authorSection = document.createElement("section");
  const pagesSection = document.createElement("section");
  const readBtn = document.createElement("button");
  const removeBtn = document.createElement("button");
  const openBookBtn = document.createElement("button");

  library.appendChild(bookSection);
  bookSection.appendChild(titleSection);
  bookSection.appendChild(authorSection);
  bookSection.appendChild(pagesSection);
  bookSection.appendChild(openBookBtn);
  bookSection.appendChild(removeBtn);
  bookSection.appendChild(readBtn);

  titleSection.textContent = `${book.title}`;
  authorSection.textContent = `By: ${book.author}`;
  pagesSection.textContent = `Pages: ${book.numberOfPages}`;
  readBtn.dataset.indexNumber = myLibrary.indexOf(book);
  removeBtn.textContent = "Remove";
  removeBtn.dataset.indexNumber = myLibrary.indexOf(book);
  openBookBtn.textContent = "Open book file";
  openBookBtn.dataset.indexNumber = myLibrary.indexOf(book);

  if(book.read)
  {
    readBtn.style.background = "#16a34a";
    readBtn.textContent = "Read";
  } 
  else
  {
    readBtn.style.background = "#dc2626";
    readBtn.textContent = "Not read yet";
  } 
  
  if(book.title.length > 20) titleSection.style.fontSize = "1rem";
  else if(book.title.length > 15) titleSection.style.fontSize = "1.3rem";
}

function removeBook(book)
{
  library.innerHTML = "";
  myLibrary = myLibrary.filter( i => i.title!==book.title);
  myLibrary.forEach(book => showCardBook(book));
}

function openFileBook(book)
{
  let urlFile = URL.createObjectURL(book.fileBook);
  let pdfWindow = window.open(urlFile,"_blank");
  pdfWindow.addEventListener('beforeunload', ()=> URL.revokeObjectURL(urlFile));
}

function changeReadStatus(e)
{
  if(myLibrary[e.target.dataset.indexNumber].read)
  {
    e.target.style.background = "#dc2626";
    e.target.textContent = "Not read yet";
    myLibrary[e.target.dataset.indexNumber].read = false;
  }
  else
  {
    e.target.style.background = "#16a34a";
    e.target.textContent = "Read";
    myLibrary[e.target.dataset.indexNumber].read = true;
  }
}

function checkAllInputsValidation(event)
{
  const inputs = [title,author,pages];
  if(!form.checkValidity(event))
  {
    event.preventDefault();
    for(let i = 0; i<3; i++) checkInputValidation(inputs[i]);
  }
  else
  { 
    for(let i=0; i<3; i++) checkInputValidation(inputs[i]);
    form.className = "";
    addBookToLibrary();
  }
}

function checkInputValidation(input)
{
    if(input.validity.valid)
    {
        errors[input.dataset.indexNumber].textContent = "";
        errors[input.dataset.indexNumber].className = "error";
    }
    else if(input.validity.valueMissing)
    {
      errors[input.dataset.indexNumber].textContent = "*This field is required";
      errors[input.dataset.indexNumber].className = "error active";
      form.className = "form-error";
    }
}

function resetValidation()
{
  const inputs = [title,author,pages];
  inputs.forEach(input =>
    {
      errors[input.dataset.indexNumber].textContent = "";
      errors[input.dataset.indexNumber].className = "error";
    })

  bookFileLabel.textContent = "Enter your book in PDF format"
  bookFileLabel.style.color = "black"
}

function showFileName()
{
  bookFileLabel.textContent = `✔ ${bookFile.files[0].name}`;
  bookFileLabel.style.color = "#16a34a"
}