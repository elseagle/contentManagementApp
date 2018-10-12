const express = require('express');
const fs  = require('fs');
const path = require('path')

const Post = require('../../models/Post');
const faker = require('faker')
const { isEmpty, uploadDir} = require('../../helpers/upload-helper');


const router  = express.Router();

// router.all('/', (req, res, next)=>{
    
//      req.app.locals.layout = 'admin';
//      next();
// })

router.all('/*',  (req, res, next)=>{


    req.app.locals.layout = 'admin';
    next();


});

router.get('/', (req, res) =>{

    Post.find({}).then(posts=>{

        res.render('admin/posts/index', {posts: posts});
    }).catch(err =>{
        console.log(err);
    });


})



router.get('/create', (req, res) =>{

    res.render('admin/posts/create', {layout: 'admin'});
})



router.post('/create', (req, res) => {



    let filename = '';


    if(!isEmpty(req.files)){

        let file = req.files.file;
        filename = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + filename, (error) => {
            if (error) throw  error;
        });


    }


    console.log(req.body);

    let allowComments = false;
    if(req.body.allowComments) {
        allowComments = true
    }

    else{
        allowComments = false
    }

    const newPost = new Post({
        title: req.body.title,
        status:req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename
    })


            newPost.save().then(savedPost =>{
                console.log(`${req.body.title} saved`)

                req.flash('success_message', 'Post was created successfully ' + savedPost.title)
                console.log(savedPost)

                res.redirect('/admin/posts');

            }).catch(error =>{

                console.log('Could not save post', error)
            })


});



router.get('/edit/:id', (req, res)=> {

    Post.findOne({_id: req.params.id}).then(post => {

        res.render('admin/posts/edit', {post: post});
    })

    // res.render('admin/posts/edit')
})


router.put('/edit/:id', (req, res)=> {

    Post.findOne({_id: req.params.id}).then(post => {


        let allowComments = false;
        if(req.body.allowComments) {
            allowComments = true
        }

        else{
            allowComments = false
        }

        post.title = req.body.title
        post.status = req.body.status
        post.allowComments = allowComments
        post.body = req.body.body

        if(!isEmpty(req.files)){

            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            post.file = filename;

            file.mv('./public/uploads/' + filename, (error) => {
                if (error) throw  error;
            });


        }
        else{
            pass
        }


        post.save().then(updatedPost =>{
            req.flash('updated_message', 'Post was successfully updated');

            res.redirect('/admin/posts');

        })







    })

    // res.render('admin/posts/edit')
})


// router.delete('/:id', (req, res)=>{
//
//     Post.deleteOne({_id: req.params.id})
//         .then(result=>{
//             res.redirect('/admin/posts')
//         }).catch(err=>{
//             if(err) throw err;
//     })
//
// })


router.post('/generate-fake-posts', (req, res)=>{

    for(let i=0; i<req.body.amount; i++ ){
        let post = new Post()
        post.title= faker.name.title();
        post.allowComments= faker.random.boolean();
        post.status = "public";
        post.body = faker.lorem.sentence();

        post.save((err)=>{
            if(err) throw err;

        });
        res.redirect('/admin/posts')


    }

})



router.delete("/:id", (req, res)=>{
    Post.findOne({_id:req.params.id})
        .then(post =>{

            fs.unlink(uploadDir+post.file, (err)=>{
                post.remove()
                req.flash('delete_message', 'Post was successfully deleted');
                res.redirect('/admin/posts');

            })


        })


})




module.exports =router;
