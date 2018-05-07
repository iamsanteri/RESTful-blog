var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log("Error");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.get("/blogs/new", function(req, res) {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  // create blog post, then redirect to index
  Blog.create(req.body.blog, (err, newBlog) => {
    if(err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id", (req, res) => {
   Blog.findById(req.params.id, (err, foundBlog) => {
     if(err) {
       res.redirect("/blogs");
     } else {
       res.render("show", {blog: foundBlog});
     }
   });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

app.put("/blogs/:id", (req, res) => {
  res.send("UPDATE ROUTE!");
});

// STARTING UP THE SERVER

app.listen(3000, process.env.IP, function() {
  console.log("Server is running...");
});
