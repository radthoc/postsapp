var welcomePost = [
    {
        "post_id": 0,
        "post_title": "Welcome to your post app",
        "post_description": "Thanks for joining us!",
        "post_owner": "admin@post_app",
        "post_date": "02/04/2016 10:23:08"
    }
];

window.onload = function () {
    //templatesFactory['render'](welcomePost);

    var newPostBt = document.getElementById('new_post');

    newPostBt.onclick = function(){
        popupsFactory['newPost']();
    };

    var closeBt = document.getElementById('close');

    closeBt.onclick = function(){
        popupsFactory['popupHandler']();
    };

    var addBt = document.getElementsByClassName("add-bt");
    addBt.onclick = function(){
        var postId = this.getAttribute("data-post");
        popupsFactory['newComment'](postId);
    };

    ajaxFactory['getPosts']();
};