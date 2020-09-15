var express=require("express");
var cors=require("cors");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
var Campground=require("./models/camp");
var Comment=require("./models/comments");
var User=require("./models/user");
// var seedDB=require("./seeds");
const session = require('express-session');
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var flash=require("connect-flash");
var ejsLint = require('ejs-lint');
require('./config/passport');

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var authRoutes=require("./routes/index");

// if (process.env.NODE_ENV !== 'production') {
	// require('dotenv').config()
//   }
 
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.DATABASEURL, {
	mongoose.connect("mongodb+srv://shivani:art_app@cluster0-m37a8.mongodb.net/test?retryWrites=true&w=majority" , {
					
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true
		}).then(()=>{
			console.log("Connected to db");
		}).catch(err=>{
			console.log("error:", err.message);
		});
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
		
app.use(require("express-session")({
	secret: "Rusty is cute",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT || 3000,  () => {
    console.log("The server is live");
})