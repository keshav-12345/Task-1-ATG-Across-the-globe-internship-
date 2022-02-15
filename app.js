require('dotenv').config();
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    User        = require("./models/user"),
    session = require("express-session"),
    methodOverride = require("method-override");

//requiring routes
    indexRoutes      = require("./routes/index")
// mongoose.connect("mongodb://localhost/yelp_camp_profiles");


const DB= process.env.PASS;
mongoose.connect(DB,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log("connection successfull")
}).catch(err=>{
  console.log("Connection Failed")
  console.log(err);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);

app.get("/home",(req,res)=>{
    res.render("home")
})

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("The server has started!!!");
  });