function loginBtnClicked(){
    const userName = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const body = {
        "username" : userName,
        "password" : password
    }

    axios.post("https://tarmeezacademy.com/api/v1/login" , body)
    .then((response => {
        let token = response.data.token;
        localStorage.setItem("token" , token);
        localStorage.setItem("user" , JSON.stringify(response.data.user));

        if(token){
            bootstrap.Modal.getInstance(document.getElementById("login-modal")).hide();
            toastMsg("logged-in successfully" , "success");
        }

        UIsetup();
    }))


}


function UIsetup(){
    const token = localStorage.getItem("token");
    const addCommentContainer = document.getElementById("addCommentContainer");
    

    if(token){

        const user = JSON.parse(localStorage.getItem("user"));

        document.getElementById("navBtns").innerHTML = `
            <button type="button" class="btn btn-outline-danger" data-bs-target="#logoutModal" data-bs-toggle="modal">Logout</button>
        `;
        
        if(window.location.pathname === "/index.html"){
            document.getElementById("addBtnContainer").style.display = "block" 
        }
        
        document.getElementById("userProfile").style.display = "block";
        document.getElementById("userProfile").innerHTML = `
            <div class="d-flex justify-content-center align-items-center gap-1" >
                <div style="width:40px; height:40px;">
                    <img src="${user ? user.profile_image : "./imgs/pngtree-cartoon-style-female-user-profile-icon-vector-illustraton-png-image_6489286.png" }" || "imgs/pngtree-cartoon-style-female-user-profile-icon-vector-illustraton-png-image_6489286.png" alt="" class="rounded-circle border border-4" style="width: 100%; height: 100%;">
                </div>
                <h4>${user ? user.username : "you are a guest"}</h4>
            </div>
        `;

        if(addCommentContainer){
            addCommentContainer.classList.add("display");
            addCommentContainer.classList.remove("notDisplay");
        }

    }else{
        document.getElementById("navBtns").innerHTML = `
            <button type="button" data-bs-toggle="modal" data-bs-target="#login-modal" data-bs-whatever="@mdo" class="btn btn-outline-success">Log-in</button>
            <button type="button" data-bs-toggle="modal" data-bs-target="#register-modal" data-bs-whatever="@mdo" class="btn btn-outline-success">Register</button>
        `;

        let addBtn = document.getElementById("addBtnContainer")
        if(addBtn){
            addBtn.style.display = "none"
        };

        document.getElementById("userProfile").style.display = "none";

        if(addCommentContainer){
            addCommentContainer.classList.remove("display");
            addCommentContainer.classList.add("notDisplay");
        }
    }
    
}
UIsetup();


function createPost(){
    const postId = document.getElementById("edit-clicked").value || null;


    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;
    const image = document.getElementById("post-image").files[0];
    const token = localStorage.getItem("token");

    const formData = new FormData();
    if(image){
        formData.append("image" , image);
    }
    formData.append("body" , body);
    formData.append("title" , title);

    const Headers = {
        "Authorization" : `Bearer ${token}`
    }

    let url = ``;
    if(postId){
        // edit
        url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
        formData.append("_method" , "put")
        msg = "edited";
    }else{
        // create
        url = "https://tarmeezacademy.com/api/v1/posts";
        msg = "edited";
        // logic = displayPostDetails();
    }

    axios.post(url , formData , {
        headers : Headers
    })
    .then((response) => {
        toastMsg(`post ${msg} successfully` , "success");
        bootstrap.Modal.getInstance(document.getElementById("create-post-modal")).hide();

    }).catch((error) => {
        console.log(error)
        return;
        toastMsg(error.response.data.message , "error");
        document.getElementById("success-toast").style.backgroundColor = "#c26d75ff";
    })


    // getPosts()
}


function logoutBtnClicked(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    bootstrap.Modal.getInstance(document.getElementById("logoutModal")).hide();
    toastMsg("logged-out successfully" , "success");
    UIsetup();
}

function registerBtnClicked(){

    const profile_image = document.getElementById("profile-img").files[0];
    const name = document.getElementById("name-input").value;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const username = document.getElementById("userName-input").value;


    const formData = new FormData();
    if(profile_image){
        formData.append("profile_image" , profile_image);
    }
    formData.append("username" , username);
    formData.append("email" , email);
    formData.append("password" , password);
    formData.append("name" , name);

    axios.post("https://tarmeezacademy.com/api/v1/register" ,formData)
    .then((response) => {
        let token = response.data.token;
        localStorage.setItem("token" , token);
        localStorage.setItem("user" , JSON.stringify(response.data.user));

        bootstrap.Modal.getInstance(document.getElementById("register-modal")).hide();

        toastMsg("registered successfully" , "success");
        UIsetup();

        console.log(response.data.user);

    }).catch((error) => {
        document.getElementById("success-toast").style.backgroundColor = "#c26d75ff";
        toastMsg(error.response.data.message , "error");
    })
    
}



function toastMsg(msg , state = "success"){
    document.getElementById("msgTxt").innerHTML= msg;
    const toastEl = document.querySelector(`.success-toast`)
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 2500 })
    toast.show();

    if(state === "success"){
        document.getElementById("success-toast").style.backgroundColor = "#198754";
    }else{
        document.getElementById("success-toast").style.backgroundColor = "#c26d75ff";
    }
}


function editBtnClicked(data){
    const postData = JSON.parse(decodeURIComponent(data));
    document.getElementById("edit-clicked").value = postData.id;

    document.getElementById("post-title").value = postData.title;
    document.getElementById("post-body").value = postData.body;
}

