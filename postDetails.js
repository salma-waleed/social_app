        function displayPostDetails(id){
            axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
            .then((response) => {
                let data = response.data.data;
                let comments = data.comments;

                let authorId = data.author.id;
                localStorage.getItem("user") ? userId = JSON.parse(localStorage.getItem("user")).id : userId = null;
                let content = `
                    <div bg-none>
                        <h1>${data.author.username} 's post</h1>
                    </div>

                    <div class="card shadow my-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <img src="${data.author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-4">
                                <strong>${data.author.username}</strong>
                            </div>
                            <div>
                                ${userId === authorId ? 
                                `<button class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#create-post-modal" data-bs-whatever="@mdo" onclick = "editBtnClicked('${encodeURIComponent(JSON.stringify(data))}')"> Edit</button>` : ``}
                            </div>
                        </div>
                        <div class="card-body">
                            <img src="${data.image || './imgs/post.jpg'}" alt="" class="w-100">
                            <h6 style="color: #9e9ba7;" class="mt-1">${data.created_at}</h6>
                            <h5>${data.title}</h5>
                            <p class="card-text">${data.body}</p>
                            <hr>
                            <div class="comments">
                                <i class="fa-solid fa-pen"></i>
                                <span>(${data.comments_count}) comments</span>
                                <div class="tags">
                                    ${(data.tags).map(tag => `<button type="button" class="btn btn-secondary mx-1 rounded-5">${tag.name}</button>`).join(" ")}
                                </div>
                            </div>
                            <hr>
                            <div class="comments-section">
                                ${comments.map(comment => `
                                    <div class="card my-2" style= "background-color: #6f8b98;">
                                        <div class="card-header">
                                            <img src="${comment.author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-4">
                                            <strong>${comment.author.username}</strong>
                                        </div>
                                        <div class="card-body" style="background-color: #9eb5b5;"">
                                            <h5 class="card-title">${comment.body}</h5>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                            <hr>
                            <div class="add-comment" id= "addCommentContainer">
                                <input type="text" class="form-control" id="comment-body" placeholder="Add a comment...">
                                <button type="button" class="btn btn-primary mt-2" onclick = "addComment(${data.id})">Add</button>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById("postDetails").innerHTML = content;

                UIsetup();
            }).catch((error) => {
                console.log(error)
            });
        }
        
        const urlParams = new URLSearchParams(window.location.search).get('id')
        displayPostDetails(urlParams);

        function addComment(postId){
            const token = localStorage.getItem("token");
            const comment = document.getElementById("comment-body").value;
            const body = {
                "body" : comment
            }

            const headers = {
                "Authorization" : `Bearer ${token}`
            }

            axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`, body , {
                headers : headers
            })
            .then((response) => {
                console.log(response.data.data)
                displayPostDetails(postId);
                document.getElementById("comment-body").value = "";
                toastMsg("comment added successfully" , "success");
            }).catch((error) => {
                toastMsg(error.response.data.message , "error");
                document.getElementById("success-toast").style.backgroundColor = "#c26d75ff";
            })
        }

