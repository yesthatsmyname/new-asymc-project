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

async function getPosts() {
    let res = await fetch('https://jsonplaceholder.typicode.com/posts');
    return await res.json();
}

async function getUsers() {
    let res = await fetch('https://jsonplaceholder.typicode.com/users');
    return await res.json();
}

function getUserByID(users, id) {
    return users.find(user => user.id == id);
}

function renderPosts(posts) {
    postsContainer.innerHTML = "";

    const limit = limitInput?.value || posts.length;

    posts.slice(0, limit).forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const user = getUserByID(allUsers, post.userId);

        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <div class="author">Author: ${user.name}</div>
        `;

        postsContainer.appendChild(postElement);
    });
}

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

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("input", handleSearch);
limitInput?.addEventListener("input", handleSearch);

window.onload = async () => {
    allPosts = await getPosts();
    allUsers = await getUsers();

    renderPosts(allPosts);
};
async function getComments() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    const data = await response.json();

    const comments = data.map(({ postId, id, name, body }) => ({
      postId,
      id,
      name,
      body
    }));

    console.log(comments);

  } catch (error) {
    console.error('Error:', error);
  }
}

getComments();
// https://link.kitm.lt/BExsyu
