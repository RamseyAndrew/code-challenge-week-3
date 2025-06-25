const BASE_URL = 'http://localhost:3000/posts';

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
        console.log(posts);
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });
    });
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const postDetail = document.getElementById('post-detail');
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
         <img src="${post.img}" alt="${post.title}" style="max-width: 100%; height: auto; margin-bottom: 1rem;" />
        <p>${post.content}</p>
        <p><em>by ${post.author}</em></p>
        <button id ="edit-btn">Edit</button>
        <button id ="delete-btn">Delete</button>
          <form id="edit-post-form" class="hidden">
          <h4>Edit Post</h4>
          <input type="text" id="edit-title" value="${post.title}" />
          <textarea id="edit-content" rows="5">${post.content}</textarea>
          <button type="submit">Save</button>
          <button type="button" id="cancel-edit">Cancel</button>
        </form>
      `;
       document.getElementById('delete-btn').addEventListener('click', () => handleDeletePost(id));

       document.getElementById('edit-btn').addEventListener('click', () => {
         document.getElementById('edit-post-form').classList.remove('hidden');
       });
 
       document.getElementById('cancel-edit').addEventListener('click', () => {
         document.getElementById('edit-post-form').classList.add('hidden');
       });
 
       document.getElementById('edit-post-form').addEventListener('submit', (e) => {
         e.preventDefault();
         handleUpdatePost(id);
       });
    });
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        form.reset();
        displayPosts();
      });
  });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);
function handleUpdatePost(id) {
    const updatedTitle = document.getElementById('edit-title').value;
    const updatedContent = document.getElementById('edit-content').value;
  
    fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedTitle,
        content: updatedContent
      })
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();            
        handlePostClick(id);       
      });
  }
  function handleDeletePost(id) {
    fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        displayPosts();             
        document.getElementById('post-detail').innerHTML = '<p>Select a post to view details</p>'; // Clear detail
      });
  }
  