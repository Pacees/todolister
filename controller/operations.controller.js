const Books = require("./../model/Book.model");
const Users = require("./../model/User.model");
const createJWT = require("./../middlewares/createJWT");
const jwt = require("jsonwebtoken");

const getUserEmail = (req, res) => {

    const email = req.user?.email;
    if(!email) return res.status(401).json({error: "user not found"});

    res.json({email: email});
};

const sendAllBooks = async (req, res) => {

    const usersBooks = req.user?.books;
    if(!usersBooks) return res.status(401).json({error: "user not found"});
    if(usersBooks.length === 0) return res.json([]);

    const response = [];

    for await(const bookId of usersBooks) {
        const book = await Books.findById(bookId);
        response.push(book);
    };
    res.json(response);
};

const sendById = async (req, res) => {

    if(req.user.books.indexOf(req.params.id) === -1) return res.json({"error": "User doesn't have this book."});

    const foundBook = await Books.findById(req.params.id);
    res.json(foundBook);
};


const createBook = async (req, res) => {

    const bookName = req.body.name;
    if(!bookName) return res.json({error: "Book name required"})

    const createdBook = await Books.create({
        name: bookName
    });

    // save book id to user.books
    await req.user.books.push(createdBook._id);
    await Users.findOneAndUpdate({email: req.user.email}, { books: req.user.books});
    const updatedUser = await Users.findOne({email: req.user.email});

    const token = await jwt.sign(
        {
        email: updatedUser.email,
        roles: updatedUser.roles,
        books: updatedUser.books
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
    );

    res.cookie('jwt', token , { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.json({success: "Created"})
};

const updateBook = async (req, res) => {

    const changeName = req.body.changeName;
    const newTodo = req.body.todo;
    const completedTodo = req.body.completed;
    const deleteOne = req.body.deleteOne; 
    const updateTodoFrom = req.body.updateTodoFrom;
    const bookId = req.params.id;
    
    // verify id
    if(req.user.books.indexOf(bookId) === -1) return res.json({"error": "You havent permission"});

    const book = await Books.findById(bookId);
    if(!book) return res.status(404).json({"error": "Book not found"});

    if(changeName){
        book.name = changeName;
        await Books.findByIdAndUpdate(bookId, {"name": book.name});
        res.json({success: "Book name changed"})
    }

    if(newTodo){
        book.todos.push(newTodo);
        await Books.findByIdAndUpdate(bookId, {todos: book.todos});
        res.json({success: "New todo added"});
    };
    if(completedTodo){
        book.completedTodos.push(completedTodo);
        await Books.findByIdAndUpdate(bookId, {"completedTodos": book.completedTodos});
        res.json({success: "Completed todo added"})
    };
    if(deleteOne){

    for await(let todo of book.todos) {
        if(todo === deleteOne){
            const index = book.todos.indexOf(todo);
            if(index === -1) return res.status(404).json({error: "Todo not found"});
            book.todos.splice(index, 1);

            //check completed todos
            const completedIndex = book.completedTodos.indexOf(deleteOne);
            if(completedIndex !== -1) deleteFromCompleteds(completedIndex);
        };
    }

    async function deleteFromCompleteds(index){
        book.completedTodos.splice(index, 1);
        await Books.findByIdAndUpdate(bookId, {completedTodos: book.completedTodos});
    };

    await Books.findByIdAndUpdate(bookId, {todos: book.todos});
    res.json({success: "Todo deleted"});
    };
    if(updateTodoFrom) {

        const updateTodoTo = req.body.to;
        if(!updateTodoTo) return res.status(404).json({error: "invalid request"});

        const index = book.todos.indexOf(updateTodoFrom);
        book.todos.splice(index, 1);
        book.todos.splice(index, 0, updateTodoTo);

        await Books.findByIdAndUpdate(bookId, {todos: book.todos});
        return res.send({success: "todo updated"})
    }

    if(!changeName && !newTodo && !completedTodo && !deleteOne && !updateTodoFrom) return res.status(404).json({error: "invalid request"});
};

const deleteTodos = async (req, res) => {
    const bookId = req.params.id;

    await Books.findByIdAndUpdate(bookId, {todos: [], completedTodos: []})

    res.sendStatus(204);
};

const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    
    const foundUser = await Users.findOne({email: req.user.email});
    if(!foundUser) return res.status(404).json({"error": "User not found"});

    const index = foundUser.books.indexOf(bookId);
    if(index === -1) return res.status(404).json({"error": "Book doesnt belong to user"});

    foundUser.books.splice(index, 1);

    await Books.findByIdAndDelete(bookId);
    await Users.findOneAndUpdate({email: req.user.email}, {books: foundUser.books});

    const token = await jwt.sign(
        {
            email: foundUser.email,
            roles: foundUser.roles,
            books: foundUser.books
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    res.cookie('jwt', token , { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.json({succes: "Book deleted"});
}

const logOut = (req, res) => {
 
    res.clearCookie("jwt");
    res.redirect("/login");
}


module.exports = { getUserEmail, sendAllBooks, sendById, createBook, updateBook, deleteTodos, deleteBook, logOut};