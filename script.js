// fill out form => create object => add to array (give data val of index)=> create card


function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// LISTNODE

function listNode(val){
    this.data = val;
    this.card;
    this.next = null;
    this.prev  = null;
}

listNode.prototype.toString = function(){
    return this.data.title;
}

// LINKED LIST

function LinkedList(node){
    // create HeadNode
    this.head = node;
}

LinkedList.prototype.appendNode = function(node){
    let cur = this.head;
    // get last node in list
    while(cur.next != null){
        cur = cur.next;
    }
    // add pointer to new node
    cur.next = node;
    node.prev = cur;
}

LinkedList.prototype.removeNode = function(node){
    // check if head node
    if(node.prev == null){
        if(node.next != null){
            this.head = node.next;
            this.head.prev = null;
        }else{
            library = null; // reset library
        }
    }else{
        if(node.next != null){
            // assign previous node's next to next node
            node.prev.next = node.next;
            //assign next node's previous to previous node
            node.next.prev = node.prev;
        }
        else{
            node.prev.next = null;
        }
    }
}

LinkedList.prototype.toString = function(){
    let cur = this.head;
    let res = "";
    while(cur.next != null){
        res += cur + " => "
        cur = cur.next;
    }
    return res + cur;
}

// helper functions 

/** 
 * Book Creation procedure to be assigned as an event listener to New book button 
 * @returns listNode object
*/
function createBook(){
    // title - String
    let title = TITLE.value;
    // author - String
    let author = AUTHOR.value;
    // pages - int
    let pages = PAGES.value;
    // read - boolean
    let isRead = READ.checked;

    if (title == "" || author == "" || pages == ""){
        ERROR.innerHTML = "Please fill in all fields.";
    }else{
        let newBook = new listNode(new Book(title, author, pages, isRead)); // fix isRead
        addBookToLibrary(newBook);
        ERROR.innerHTML = "";
        FORM.reset();
        hideForm();
    }
}

/** sets form as active and resets fields - to be attatched to new Book event listener*/
function showForm(){
    WRAPPER.classList.remove("inactive");
    WRAPPER.classList.add("active");
}

/** sets form as inactive - to be included in submit button event listener*/
function hideForm(){
    WRAPPER.classList.remove("active");
    WRAPPER.classList.add("inactive");
}

/** Add node to linked list and div child to page */
function addBookToLibrary(node){
    if(!library){
        library = new LinkedList(node);
    }else{
        library.appendNode(node);
    }
    BODY.appendChild(createCard(node));
}

/** Remove node from linked list and div child from page */
function removeBookFromLibrary(node){
    library.removeNode(node);
    // Remove card from page
    BODY.removeChild(node.card);
    
}

/** 
 * Creates card object and assigns event listeners to buttons
 * @param node list node with Book object stored in data attribute 
 * @returns DOM element div "card"
*/
function createCard(node){
    let book = node.data;
    let card = document.createElement("div");
    card.classList.add("card");
    // create X to remove node
    let remove = document.createElement("p");
    remove.innerHTML = "X";
    remove.classList.add("remove");
    remove.addEventListener("click", () => removeBookFromLibrary(node));
    // Card Body
    let heading = document.createElement("h2");
    heading.innerHTML = book.title;
    let author = document.createElement("p");
    author.innerHTML = book.author;
    let pageCount = document.createElement("p");
    pageCount.innerHTML = `${book.pages} pages`;
    // Interactive Button
    let readButton = document.createElement("div");
    readButton.addEventListener("click", (e) => change(e, node));
    readButton.classList.add("readButton");
    if(book.read){
        readButton.innerHTML = "Read"
        readButton.classList.add("read")
        readButton.dataset.status = true;
    }else{
        readButton.innerHTML = "Unread";
        readButton.classList.add("unread")
        readButton.dataset.status = false;
    }

    // build card
    card.appendChild(remove);
    card.appendChild(heading);
    card.appendChild(author);
    card.appendChild(pageCount);
    card.appendChild(readButton);

    // keep reference for deletion
    node.card = card;
    return card;
}

/** Generate all books in library linked list (Used to restore session)*/
function listBooks(){
    let cur = library.head;
    while(cur != null){
        BODY.appendChild(createCard(cur));
        cur = cur.next;
    }
}

/** Event Listener Function that changes 'read' status of book object */
function change(e, node){
    // 'read' button has attribute called status
    let button = e.target;
    if(button.dataset.status === "true"){ 
        // change display
        button.classList.remove("read");
        button.classList.add("unread");
        button.innerHTML = "Unread";
        button.dataset.status = "false";
        // update object
        node.read = false;
        console.log(node);
        

    }else{
        // change display
        button.classList.remove("unread");
        button.classList.add("read");
        button.innerHTML = "Read";
        button.dataset.status = "true";
        // update object
        node.read = true;
    }
}


let library = null;
const BODY = document.querySelector("body");
const NEWBOOK = document.getElementById("new");
const EXITFORM = document.getElementById("exitForm");
const WRAPPER = document.getElementById("formWrapper");
const FORM = document.getElementById("popup");
const TITLE = document.getElementById("title");
const AUTHOR = document.getElementById("author");
const PAGES = document.getElementById("pages");
const READ = document.getElementById("isRead");
const ERROR = document.getElementById("error");
const SUBMIT = document.getElementById("create");

// Initialize event listeners
SUBMIT.addEventListener("click", createBook);
EXITFORM.addEventListener("click", hideForm);
NEWBOOK.addEventListener("click", showForm);