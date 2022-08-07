if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Alumni = require('./models/alumni');
const methodOverride = require('method-override');
const Student = require('./models/student');
const Comment = require("./models/comment")
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/slam-book'
const axios = require('axios');
const { response } = require('express');
const Client_Secret = process.env.client_secret;
const Client_Id = process.env.client_id;
const qs = require('qs');
const { render } = require('ejs');

mongoose.connect(dbUrl,{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connceted");
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.get('/auth/callback',(req,res)=>{
    const auth_code = req.query.code;
    const state = req.query.state;
    // if(auth_code){
    //     var data = qs.stringify({
    //         'client_id': Client_Id,
    //         'client_secret': Client_Secret,
    //         'grant_type': 'authorization_code',
    //         'code': auth_code,
    //         'redirect_uri': 'https://glacial-river-34992.herokuapp.com/auth/callback' 
    //     });
    //     var config = {
    //         method: 'post',
    //         url: 'https://auth.delta.nitt.edu/api/oauth/token',
    //         headers: { 
    //           'Content-Type': 'application/x-www-form-urlencoded', 
    //         },
    //         data : data
    //     };
    //     axios(config)
    //     .then(function (response) {
    //         // id_token = JSON.parse((Buffer.from((response.data.id_token.split(".")[1]),'base64').toString));
    //         // const email = id_token.email;
    //         // const name = id_token.name;
    //         // if(state == "register"){
    //         //     res.redirect(`/reg?name=${name}&id=${id}`);    
    //         // } 
    //         res.send(JSON.stringify(response.data));
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //         res.redirect('/?text=invalidcreds');
    //     });
    // }
    // else{
    //     res.redirect(`/`);
    // }
    res.send(auth_code);
})

app.get('/reg',(req,res)=>{
    const name = req.query.name;
    const ID = req.query.id.slice(0,-9);
    res.render('register.ejs',{name,ID});
    // //const token = req.headers.authorization.substring(7);
    // res.render('regis',{name,ID});
})

app.post('/reg', async(req,res)=>{
    const name = req.body.name;
    const id = req.body.id;
    const type = req.body.type;
    if(type == "alumni"){
        const initial = await Alumni.find({id:`${id}`}).exec();
        if(initial){
            const msg = {text:"again"}
            res.send(msg);
        }
        else{
            const alumni = new Alumni(name,id);
            await alumni.save();
            const msg = {text : "registered"}
            res.send(msg);
        }
    }
    else{
        const initial = await Student.find({id:`${id}`}).exec();
        if(initial){
            const msg = {text:"again"}
            res.send(msg);
        }
        else{
            const student = new Student(name,id);
            await student.save();
            const msg = {text : "registered"}
            res.send(msg);
        }
    }
})


app.get('/',(req,res)=>{
    var msg = req.query.text;
    if(!msg){
        msg = "nothing"
    }
    res.render('home',{msg});
})

app.get('/alumnis',async(req,res)=>{
    const alumnis = await Alumni.find({});
    res.render('alumnis/index',{alumnis});
})

app.post('/alumnis', async (req,res)=>{
    const alumni = new Alumni(req.body.alumni);
    await alumni.save();
    res.redirect(`/alumnis/${alumni._id}`);
})

app.get('/alumnis/new',(req,res)=>{
    res.render('alumnis/new');
})

app.put('/alumnis/:id',async(req,res)=>{
    const id = req.params.id;
    const alumni = await Alumni.findByIdAndUpdate(id,{name : `${req.body.alumni.name}`, YearOfGraduation : `${req.body.alumni.YearOfGraduation}`});
    res.redirect(`/alumnis/${id}`);
})

app.get('/alumnis/:id',async(req,res)=>{
    const alumni = await Alumni.findById(req.params.id).populate('comments');
    res.render('alumnis/show',{alumni});
})

app.delete('/alumnis/:id',async(req,res)=>{
    const id =req.params.id;
    const alumni = await Alumni.findById(id);
    for(let comm of alumni.comments){
        await Comment.findByIdAndDelete(comm._id);
    }
    await Alumni.findByIdAndDelete(id);
    res.redirect('/alumnis');
})

app.get('/alumnis/:id/edit',async(req,res)=>{
    const alumni = await Alumni.findById(req.params.id);
    res.render('alumnis/edit',{alumni});
})

app.get('/alumnis/:id/add_comment',async(req,res)=>{
    const alumni = await Alumni.findById(req.params.id);
    res.render('alumnis/new_comment',{alumni});
})

app.post('/alumnis/:id/comments', async(req,res)=>{
    const alumni = await Alumni.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    alumni.comments.push(comment);
    await comment.save();
    await alumni.save();
    res.redirect(`/alumnis/${alumni._id}`);
})

app.delete('/alumnis/:id/comments/:comment_id',async(req,res)=>{
    const {id,comment_id} = req.params;
    await Alumni.findByIdAndUpdate(id,{$pull:{comments:comment_id}});
    await Comment.findByIdAndDelete(comment_id);
    res.redirect(`/alumnis/${id}`);
})

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Listening on ${port}`);
})




// sudo docker run -dp 27017:27017 -v /home/shubham/Documents/data/db:/data/db --name local-mongo --restart=always mongo
// GWo_lbhI8Qbk4awzRi3nvwjQa7cQYuGl

