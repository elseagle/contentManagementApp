const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const {select, generateTime} = require('./helpers/handlebars-helpers');
const session = require('express-session');
const flash = require('connect-flash');


mongoose.connect('mongodb://localhost:27017/cms',  { useNewUrlParser: true }).then((db)=>{
    console.log('Mongo Connected');
}).catch(error=> console.log(error))    


mongoose.Promise = global.Promise;

const app = express();

app.engine('handlebars', handlebars({defaultLayout: 'home', helpers:{select: select, generateTime: generateTime}}));
app.set('view engine', 'handlebars');



//MethodOverride
app.use(methodOverride('_method'))

//Upload

app.use(upload());



//Body Parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use( express.static(path.join(__dirname, 'public')));

//Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
// const createPost = require('./routes/admin/posts');



//I didint use this
app.use(session({

    secret: 'sogo',
    resave: true,
    saveUninitialized: true,

}));



app.use(flash());


//Local Variable using middleware

app.use((req, res, next)=>{

    res.locals.success_message = req.flash('success_message');
    next();
})


app.use((req, res, next)=>{

    res.locals.delete_message = req.flash('delete_message');

    next();
});

app.use((req, res, next)=>{
;
    res.locals.update_message = req.flash('updated_message');

    next();
})


//Use Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
// app.use('/admin/posts/create', createPost);




const port =  4400;

app.listen (port,  ()=>{
        console.log(`Server at ${port}`)
})
