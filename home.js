
// handling infinite scrolling
let currentPage = 1;
let lastPage = 1;


window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY >= document.body.offsetHeight) && (currentPage < lastPage)) {
        currentPage++;
        getPosts(currentPage);
    }
});

function getPosts(page){
            axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
            .then((response) => {

                let userId = JSON.parse(localStorage.getItem("user"));
                userId = userId ? userId.id : null;
                lastPage = response.data.meta.last_page;
                if(page === 1){
                    document.getElementById("postsContainer").innerHTML = "";
                }
                const posts = response.data.data

                for(let post of posts){
                    let author = post.author;
                    let postTitle = post.title || "";
                    let tags = post.tags || [];
                    let authorId = author.id;

                    let content = `
                        <div class="card shadow my-4" id="post-${post.id}" onclick="displayPostDetails(${post.id})">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <img src="${author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-4">
                                    <strong>${author.username}</strong>
                                </div>

                                <div>
                                    ${userId === authorId ? `
                                        <button class="btn btn-secondary btn-sm">Edit</button>` : ``}
                                </div>

                                
                            </div>
                            <div class="card-body">
                                <img src="${post.image || './imgs/post.jpg'}" alt="" class="w-100">
                                <h6 style="color: #9e9ba7;" class="mt-1">${post.created_at}</h6>
                                <h5>${postTitle}</h5>
                                <p class="card-text">${post.body}</p>
                                <hr>
                                <div class="comments">
                                    <i class="fa-solid fa-pen"></i>
                                    <span>(${post.comments_count}) comments</span>
                                    <div class="tags">
                                        ${tags.map(tag => `<button type="button" class="btn btn-secondary mx-1 rounded-5">${tag.name}</button>`).join("")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    document.getElementById("postsContainer").innerHTML += content;
                }
                }).catch((error) => {
                    console.log(error)
                })
}


function displayPostDetails(id){
    window.location.href = `postDetails.html?id=${id}`;
}
    
getPosts();
UIsetup();