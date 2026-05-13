const style = document.createElement("style");

style.textContent = `
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f4f6f8;
    }

    header {
        background: #4a90e2;
        color: white;
        padding: 15px;
        text-align: center;
        font-size: 24px;
    }

    #posts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 15px;
        padding: 15px;
    }

    .post {
        background: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .author {
        margin-top: 10px;
        font-size: 14px;
        color: #888;
    }

    .comments {
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #ddd;
    }

    .comment {
        background: #f9f9f9;
        padding: 8px;
        border-radius: 6px;
        margin-top: 8px;
    }

    .comment-name {
        font-weight: bold;
        font-size: 14px;
    }

    .comment-body {
        font-size: 14px;
        margin-top: 5px;
    }
`;

document.head.appendChild(style);

const header = document.createElement("header");
header.textContent = "Posts";
document.body.prepend(header);

const postsContainer = document.getElementById("posts");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchByName");
const limitInput = document.getElementById("limitPosts");

let allPosts = [];
let allUsers = [];
let allComments = [];

// FETCH POSTS
async function getPosts() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    return await res.json();
}

// FETCH USERS
async function getUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    return await res.json();
}

// FETCH COMMENTS
async function getComments() {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments');
    return await res.json();
}

// FIND USER
function getUserByID(users, id) {
    return users.find(user => user.id == id);
}

// GET COMMENTS FOR POST
function getCommentsByPostId(postId) {
    return allComments.filter(comment => comment.postId == postId);
}

// RENDER POSTS
function renderPosts(posts) {
    postsContainer.innerHTML = "";

    const limit = limitInput?.value || posts.length;

    posts.slice(0, limit).forEach(post => {

        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const user = getUserByID(allUsers, post.userId);

        const comments = getCommentsByPostId(post.id);

        // CREATE COMMENTS HTML
        const commentsHTML = comments.slice(0, 3).map(comment => `
            <div class="comment">
                <div class="comment-name">${comment.name}</div>
                <div class="comment-body">${comment.body}</div>
            </div>
        `).join("");

        postElement.innerHTML = `
            <h3>${post.title}</h3>

            <p>${post.body}</p>

            <div class="author">
                Author: ${user.name}
            </div>

            <div class="comments">
                <h4>Comments</h4>
                ${commentsHTML}
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// SEARCH
function handleSearch() {

    const query = searchInput.value.toLowerCase();

    const filteredPosts = allPosts.filter(post => {

        const user = getUserByID(allUsers, post.userId);

        return (
            post.title.toLowerCase().includes(query) ||
            post.body.toLowerCase().includes(query) ||
            user.name.toLowerCase().includes(query)
        );
    });

    renderPosts(filteredPosts);
}

// EVENTS
searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("input", handleSearch);

limitInput?.addEventListener("input", handleSearch);

// LOAD EVERYTHING
window.onload = async () => {

    allPosts = await getPosts();

    allUsers = await getUsers();

    allComments = await getComments();

    renderPosts(allPosts);
};
