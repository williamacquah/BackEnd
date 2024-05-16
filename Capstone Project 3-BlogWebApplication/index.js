import express from "express";
import bodyParser from "body-parser";
import { render } from "ejs";
import {v4 as uuidv4} from "uuid";

const app = express();
const port = 3000;

const isLoggedIN = (res, req, next) => {
    const isLoggedIn = true;
    if (isLoggedIn) {
        next();
    }
    else{
        res.redirect("login.ejs");
    }
};

function getPostByID(postID) {
    return posts.find(post => post.postID === postID);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});
  
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/post", (req, res) => {
    res.render("post.ejs", {posts: posts});
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/create", isLoggedIN, (req, res) => {
    res.render("createPost.ejs");
});

app.get("/edit/:postID", (req, res) => {
    const postID = req.params.postID;
    const post = getPostByID(postID);

    if (!post){
        res.status(404).send("Post not found");
        return;
    }
    res.render("editPost.ejs",{post: post});
});

app.post("/update/:postID", (req, res) => {
    const postID = req.params.postID;
    const updatedTitle = req.body.title;
    const updatedContent = req.body.content;

    // Find the post in the posts array by postID
    const postIndex = posts.findIndex(post => post.postID === postID);

    if (postIndex !== -1) {
        // Update the post's title and content
        posts[postIndex].postTitle = updatedTitle;
        posts[postIndex].postContent = updatedContent;

        // Redirect to the post page after updating
        res.redirect("/post");
    } else {
        // If the post is not found, send a 404 error
        res.status(404).send("Post not found");
    }
});

app.post("/delete/:postID", (req, res) => {
    const postID = req.params.postID;

    // Find the index of the post with the given postID in the posts array
    const postIndex = posts.findIndex(post => post.postID === postID);

    if (postIndex !== -1) {
        // Remove the post from the posts array
        posts.splice(postIndex, 1);

        // Redirect to the post page after deleting
        res.redirect("/post");
    } else {
        // If the post is not found, send a 404 error
        res.status(404).send("Post not found");
    }
});

app.get("/search", (req, res) => {
    res.render("searchResults.ejs");
});

app.post("/", (req, res) => {
    res.render("index.ejs");
  });

app.post("/login", (req, res) => {
    res.render("login.ejs");
  });

app.post("/create", isLoggedIN, (req, res) => {
    res.render("creatPost.ejs");
});

app.post("/register", (req, res) => {
    res.render("register.ejs");
});

let posts = [];

app.post("/submit", (req, res) => {
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        const formattedDate = new Date().toLocaleDateString('en-US', options);

        const data = {
            postTitle: req.body.title,
            postContent: req.body.content,
            date: formattedDate, // Store formatted date
            postID: uuidv4(),
        };

        // Add the new post to the posts array
        posts.push(data);

        // Render the post page with posts array
        res.render("post.ejs", { posts: posts });
    } catch (error) {
        console.error("Error processing form submission:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});