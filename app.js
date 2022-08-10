if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const methodOverride = require('method-override');
const Comment = require("./models/comment")
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/slam-book'
const axios = require('axios');
const Client_Secret = process.env.client_secret;
const Client_Id = process.env.client_id;
var bodyParser = require('body-parser')
const qs = require('qs');
const jwt = require('jsonwebtoken');
const Token_Secret = process.env.token_secret;

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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const verify_token = (req,res,next)=>{
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,Token_Secret,(err,dec)=>{
        if(err){
            res.status(401).send("Token sadge");
        }
        else{
            const payload = jwt.decode(token);
            const exp = payload.exp;
            let curr = new Date();
            curr = curr.getTime();
            curr=Math.floor(curr/1000);
            if((exp-curr) < 180){
                const name = payload.name;
                const ID = payload.id;
                const type = payload.type;
                token = jwt.sign({
                    id : ID,
                    name : name,
                    type : type
                },Token_Secret, { expiresIn: '600s'});
            }
            // req.headers.authorization = "Bearer "+token;
            res.header('authorization',"Bearer "+token);
            next();
        }
    })
}

app.get('/',(req,res)=>{
    var msg = req.query.text;
    if(!msg){
        msg = "nothing"
    }
    res.render('home',{msg});
})


app.get('/auth/callback',(req,res)=>{
    const auth_code = req.query.code;
    const state = req.query.state;
    if(auth_code){
        var data = qs.stringify({
            'client_id': Client_Id,
            'client_secret': Client_Secret,
            'grant_type': 'authorization_code',
            'code': auth_code,
            'redirect_uri': 'https://glacial-river-34992.herokuapp.com/auth/callback' 
        });
        var config = {
            method: 'post',
            url: 'https://auth.delta.nitt.edu/api/oauth/token',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded', 
            },
            data : data
        };
        axios(config)
        .then(function (response) {
            id_token = JSON.parse((Buffer.from((response.data.id_token.split(".")[1]),'base64').toString()));
            const email = id_token.email;
            const name = id_token.name;
            const ID = email.slice(0,-9);
            if(state == "register"){
                let token = jwt.sign({
                    id : ID,
                    name : name,
                },Token_Secret, { expiresIn: '120s'});
                res.redirect(`/reg?name=${name}&id=${token}`);    
            }
            else if(state == "login"){
                async function proccess(){
                    const initial = await User.find({Id:`${ID}`}).exec();
                    if(initial.length!=0){
                        const type = initial[0].type;
                        let token = jwt.sign({
                            id : ID,
                            name : name,
                            type : type
                        },Token_Secret, { expiresIn: '600s'});
                        token = "Bearer "+token;
                        res.render('login',{token,ID});
                    }
                    else{
                        res.redirect('/?text=register');
                    }
                }
                proccess();
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log("here");
            res.redirect('/?text=invalidcreds');
        });
    }
    else{
        res.redirect(`/`);
    }
})

app.get('/reg',(req,res)=>{
    const name = req.query.name;
    const token = req.query.id;
    try{
        const payload = jwt.decode(token);
        const ID = payload.id;
        res.render('register.ejs',{name,ID});
    }
    catch(e){
        res.redirect('/?text=tokenissue');
    }
})

app.post('/reg', async(req,res)=>{
    const name = req.body.name;
    const id = req.body.id;
    const type = req.body.type;
    if(/^\d+$/.test(id)){
        if(type === "alumni"){
            const initial = await User.find({Id:`${id}`}).exec();
            if(initial.length!=0){
                const msg = {text:"again"}
                res.send(msg);
            }
            else{
                const alumni = new User();
                alumni.name = name;
                alumni.Id =id;
                alumni.type = "alumni";
                await alumni.save();
                const msg = {text : "registered"}
                res.send(msg);
            }
        }
        else if(type === "student"){
            const initial = await User.find({Id:`${id}`}).exec();
            console.log(initial);
            if(initial.length!=0){
                const msg = {text:"again"}
                console.log(`sent here with ${msg}`)
                res.send(msg);
            }
            else{
                const student = new User();
                student.name = name;
                student.Id = id;
                student.type = "student";
                let gg = await student.save();
                const msg = {text:"registered"}
                console.log(`sent with done`)
                res.send(msg);
            }
        }
        else{
            const msg = {text:"und"}
            res.send(msg);
        }
    }
    else{
        const msg = {text:"und"}
        res.send(msg);
    }
})

app.get('/user/:id',(req,res)=>{
    const id = req.params.id;
    res.render('user/show',{id});
})

app.post('/user/:id',verify_token,async(req,res)=>{
    const token = res.getHeaders()['authorization'].split(" ")[1];
    const payload = jwt.decode(token);
    const finder_id = payload.id;
    const id = req.params.id;
    const user_arr = await User.find({Id:`${id}`}).exec();
    if(user_arr.length!=0){
        const user = user_arr[0];
        comment_arr=[];
        let comments = user.comments
        for(let i=0;i<comments.length;i++){
            const comment = await Comment.findById(comments[i]);
            comment_arr.push(comment.body);
        }
        res.send({user,comment_arr,finder_id});
    }
    else{
        res.status(404).send("Not Found");
    }
})

app.get('/user/:id/:adder/add_comment',async(req,res)=>{
    const user = await User.find({Id:req.params.id}).exec();
    if(user.length==0){
        res.redirect('/?text=nouser');
    }
    else{
        const name = user[0].name
        res.render('user/add_comment',{name});
    }
})

app.post('/user/:id/:adder/add_comment',verify_token,async(req,res)=>{
    const token = res.getHeaders()['authorization'].split(" ")[1];
    const payload = jwt.decode(token);
    const to_add = req.body.to_add;
    const adder = payload.id;
    const user_arr = await User.find({Id:to_add}).exec();
    const adder_arr = await User.find({Id:adder}).exec();
    if(adder_arr.length>0 && adder!=to_add){
        const user = user_arr[0];
        const comment = new Comment();
        comment.Id = adder;
        comment.body = req.body.body;
        user.comments.push(comment);
        await comment.save();
        await user.save();
        res.send("Added");
    }
    else{
        res.status(401).send("User not registered");
    }
})

//ignore from here

// app.post('/login',verify_token,async(req,res)=>{
//     const token = req.headers.authorization.split(" ")[1];
//     const payload = jwt.decode(token);
//     const ID = payload.id;
//     const user_arr = await User.find({Id:`${ID}`}).exec();
//     const user = user_arr[0];
//     res.render('/user/show',{user});
// })

// app.get('/alumnis',async(req,res)=>{
//     // const alumnis = await User.find({});
//     // console.log(req.headers.authorization.split(" ")[1]);
//     // res.render('alumnis/index',{alumnis});
//     // const token = req.headers.authorization.split(" ")[1];
//     const token = jwt.sign({
//         what : "whatev"
//     },Token_Secret, { expiresIn: '600s'});
//     res.render('login',{token})
// })

// app.post('/alumnis', async (req,res)=>{
//     const alumni = new User(req.body.alumni);
//     await alumni.save();
//     res.redirect(`/alumnis/${alumni._id}`);
// })

// app.get('/alumnis/new',(req,res)=>{
//     res.render('user/new');
// })

// app.put('/alumnis/:id',async(req,res)=>{
//     const id = req.params.id;
//     const alumni = await Alumni.findByIdAndUpdate(id,{name : `${req.body.alumni.name}`, YearOfGraduation : `${req.body.alumni.YearOfGraduation}`});
//     res.redirect(`/alumnis/${id}`);
// })

// app.get('/alumnis/:id',async(req,res)=>{
//     const alumni = await Alumni.findById(req.params.id).populate('comments');
//     res.render('user/show',{alumni});
// })

// app.delete('/alumnis/:id',async(req,res)=>{
//     const id =req.params.id;
//     const alumni = await Alumni.findById(id);
//     for(let comm of alumni.comments){
//         await Comment.findByIdAndDelete(comm._id);
//     }
//     await Alumni.findByIdAndDelete(id);
//     res.redirect('/alumnis');
// })

// app.get('/alumnis/:id/edit',async(req,res)=>{
//     const alumni = await Alumni.findById(req.params.id);
//     res.render('user/edit',{alumni});
// })

// app.get('/alumnis/:id/add_comment',async(req,res)=>{
//     const alumni = await Alumni.findById(req.params.id);
//     res.render('user/new_comment',{alumni});
// })

// app.post('/alumnis/:id/comments', async(req,res)=>{
//     const alumni = await Alumni.findById(req.params.id);
//     const comment = new Comment(req.body.comment);
//     alumni.comments.push(comment);
//     await comment.save();
//     await alumni.save();
//     res.redirect(`/alumnis/${alumni._id}`);
// })

// app.delete('/alumnis/:id/comments/:comment_id',async(req,res)=>{
//     const {id,comment_id} = req.params;
//     await Alumni.findByIdAndUpdate(id,{$pull:{comments:comment_id}});
//     await Comment.findByIdAndDelete(comment_id);
//     res.redirect(`/alumnis/${id}`);
// })

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Listening on ${port}`);
})




// sudo docker run -dp 27017:27017 -v /home/shubham/Documents/data/db:/data/db --name local-mongo --restart=always mongo
// GWo_lbhI8Qbk4awzRi3nvwjQa7cQYuGl

