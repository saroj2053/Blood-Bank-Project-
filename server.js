var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require("passport");
var session = require('express-session');
var methodOverride = require("method-override");
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var passportConf = require('./config/passport');
var LocalStrategy = require("passport-local").Strategy;
var morgan = require("morgan");
var User = require("./models/user");
var Admin = require("./models/admin");
var Member = require("./models/member");
var Donor = require("./models/donor");
var BloodRequest = require("./models/bloodRequest");
var Employee = require("./models/employee");

mongoose.connect("mongodb://localhost:27017/BloodBankDB", {useNewUrlParser : true});

app.set("view engine","ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(flash());
app.use(session({
    secret:"Mt. Everest is in Nepal",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.currentAdmin = req.admin;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
  });



app.get("/signup",function(req,res){
    res.render("signup",{errors: req.flash('errors')});
})

app.post('/signup', function(req, res, next) {
    var user = new User();
    user.firstName = req.body.firstname;
    user.lastName = req.body.lastname;
    user.username = req.body.username;
    user.password = req.body.password;

    User.findOne({ username: req.body.username }, function(err, existingUser) {
  
      if (existingUser) {
        req.flash('errors', 'Account with that username already exists');
        return res.redirect('/signup');
      } else {
        user.save(function(err, user) {
            res.redirect('/users/login');
  
          });
        }
        });
    });
 
      
app.post('/users/login', passport.authenticate('local-login', {
    successRedirect: '/users/home',
    failureRedirect: '/users/login',
    failureFlash: true
}));


app.get('/',function(req,res){
    res.render("landing");
});


app.get('/users/home',isUserLoggedIn,function(req,res){
    res.render("users/home");
});


app.get("/users/login",function(req,res){
    res.render("users/login",{message: req.flash('loginMessage'),});
});

// app.get('/users/about',isUserLoggedIn,function(req,res){
//     res.render("users/about");
// });
app.get("/users/bloodRequest",isUserLoggedIn,function(req,res){
    res.render("users/bloodRequest");
});

app.post("/users/grantedRequest",isUserLoggedIn,function(req,res){
    var name = req.body.name;
    var age = req.body.age;
    var location = req.body.location;
    var phone = req.body.phone;
    var blood_request = req.body.bloodGroup;

    var newBloodRequest = new BloodRequest ({
        name: name,
        age: age,
        location: location,
        phone: phone,
        bloodGroup: blood_request
    })
    BloodRequest.create(newBloodRequest,function(err,bloodRequests){
        if(err){
            console.log(err);
        } else {
            res.render("users/grantedRequest");
        }
    })    
});

app.get('/users/register',isUserLoggedIn,function(req,res){
    res.render("users/register");
});

app.get('/users/about',isUserLoggedIn,function(req,res){
    Member.find({},function(err,allMembers){
        if(err){
            console.log(err);
        } else {
            res.render("users/about",{ members:allMembers });
            
        }
    }); 
});



app.get("/admin/login",function(req,res){
    res.render("admin/login");
});


app.post("/admin/login", passport.authenticate("local",
{ 
    successRedirect: "/admin/home",
    failureRedirect: "/admin/login"
}), function(req,res) {
    });

    
app.get('/admin/home',function(req,res){
    res.render("admin/home");
});

// app.get("/admin/employee",function(req,res){
//     res.render("admin/employee");
// });

app.get("/usr_profile",function(req,res){
    res.render("users/profile_page");
});


app.get("/user_logout",function(req,res){
    req.logout();
    req.flash("success","You are successfully logged out!!!");
    res.redirect("/users/login");
});

app.get("/admin_logout",function(req,res){
    req.logout();
    req.flash("success","You are successfully logged out!!!");
    res.redirect("/admin/login");
    });
    
app.post("/admin/home",function(req,res){
    var fn = req.body.firstName;
    var mn = req.body.middleName;
    var ln = req.body.lastName;
    var usrName = req.body.username;
    var pass = req.body.password;
    var date_of_birth = req.body.dob;
    var designation = req.body.designation;
    var contact = req.body.mobile;

    var newEmployee = new Employee({
        first_name: fn,
        middle_name: mn,
        last_name: ln,
        username: usrName,
        password: pass,
        date_of_birth: date_of_birth,
        designation: designation,
        contact_number: contact
    });
    Employee.create(newEmployee,function(err,employees){
        if(err){
            console.log(err);
        } else {
            console.log("Register success");
            req.flash('success',"New Employee Registration has been done successfully");
            res.redirect("/admin/home");
        }
    })
});


app.post("/users/register",isUserLoggedIn,function(req,res){
    var firstName = req.body.firstName;
    var lastName  = req.body.lastName;
    var emailAddress = req.body.email;
    var dateOfBirth = req.body.dob;
    var donorGender = req.body.gender;
    var bloodGroup  = req.body.blood_group;
    var donorAddress = req.body.address;
    var donorCity   = req.body.city;
    var contact = req.body.mobile;

    var newDonor = new Donor({
        first_name: firstName, 
        last_name: lastName,
        email_address: emailAddress,
        date_of_birth: dateOfBirth,
        gender: donorGender,
        blood_group: bloodGroup,
        donor_address: donorAddress,
        donor_city: donorCity,
        contact_number: contact
    });

    Donor.create(newDonor,function(err,donor){
        if(err){
            console.log(err);
        } else {
            console.log("Register success");
            req.flash('success',"New Donor Registration has been done successfully");
            res.redirect("/users/register");
        }
    })
});

app.get("/admin/employee",function(req,res){
    Employee.find({},function(err,employees){
        if(err) {
            console.log(err);
        } else {
            res.render("admin/employee",{ employees:employees });
        }
    });
});

app.get("/donors", isUserLoggedIn ,function(req,res){
    Donor.find({},function(err,donors){
        if(err){
            console.log(err);
        } else {
            res.render("donor", {donors:donors});
        }
    });
    
});
app.post('/donors', isUserLoggedIn, function(req,res){
    Donor.find({ blood_group: req.body.blood_group },function(err,donors){
        if(err){
            console.log(err);
        } else {
            res.render("donor",{ donors:donors });  
        }
    }); 
});

app.get('/users/availability',function(req,res){
    res.render("users/availability");
});

function isUserLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/users/login");
}


//------
//EDIT EMPLOYEE FORM
//------

app.get("/employees/:id/edit",function(req,res){
    Employee.findById(req.params.id, function(err, foundEmployee){
        if(err){
            res.redirect("back");
        } else {
            res.render("admin/edit", { employee: foundEmployee });    
        }
    });
});

//-----------
//UPDATE EMPLOYEE DETAIL
//-----------

app.put("/employees/:id",function(req,res){
    Employee.findByIdAndUpdate(req.params.id , req.body.employee, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/admin/employee");
        }
    });
});

//---------
//EMPLOYEE DELETE
//-----------

app.delete("/employees/:id", function(req, res){
    Employee.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/admin/employee");
        }
    });
});

function isAdminLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login first");
    res.redirect("/admin/login");
}


app.listen(8888,function(){
    console.log("Server started on port 8888");
});