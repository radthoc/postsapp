var templatesFactory = {
    renderPost: function (postToRender) {
        var container = document.getElementById("container");

        var newContent = document.createElement('div');
        newContent.setAttribute('id', postToRender.post_id);
        newContent.setAttribute('class', 'content');

        var newPost = document.createElement('div');
        newPost.setAttribute('class', 'post');

        var newPostTitle = document.createElement('p');
        newPostTitle.setAttribute('class', 'title');
        newPostTitle.innerHTML = postToRender.post_title;

        var newAddBt = document.createElement('a');
        newAddBt.setAttribute('href', 'javascript:void(0)');
        newAddBt.setAttribute('class', 'add-bt');
        newAddBt.setAttribute('title', 'add a comment');
        newAddBt.setAttribute('data-post', postToRender.post_id);
        newAddBt.setAttribute('onclick', 'popupsFactory["newComment"](this)');
        newAddBt.innerHTML = '+';

        newPostTitle.appendChild(newAddBt);

        var newPostDescription = document.createElement('p');
        newPostDescription.setAttribute('class', 'description');
        newPostDescription.innerHTML = validationFunctions['urlifyText'](postToRender.post_description);

        var newPostOwner = document.createElement('span');
        newPostOwner.setAttribute('class', 'owner');
        newPostOwner.innerHTML = postToRender.post_owner;

        var newPostDate = document.createElement('span');
        newPostDate.setAttribute('class', 'date');
        newPostDate.innerHTML = postToRender.post_date;

        newPost.appendChild(newPostTitle);
        newPost.appendChild(newPostDescription);
        newPost.appendChild(newPostOwner);
        newPost.appendChild(newPostDate);

        newContent.appendChild(newPost);

        //container.insertBefore(newContent,container.childNodes[0]);

        container.appendChild(newContent);
    },
    renderComment: function (commentToRender) {
        var postContainer = document.getElementById(commentToRender.post_id);

        var newComment = document.createElement('div');
        newComment.setAttribute('class', 'comment');

        var newCommentOwner = document.createElement('span');
        newCommentOwner.setAttribute('class', 'owner');
        newCommentOwner.innerHTML = commentToRender.comment_user;

        var newCommentDate = document.createElement('span');
        newCommentDate.setAttribute('class', 'date');
        newCommentDate.innerHTML = commentToRender.comment_date;

        var newCommentDescription = document.createElement('p');
        newCommentDescription.setAttribute('class', 'description');
        newCommentDescription.innerHTML = commentToRender.comment_description;

        newComment.appendChild(newCommentOwner);
        newComment.appendChild(newCommentDate);
        newComment.appendChild(newCommentDescription);

        postContainer.appendChild(newComment);
    },
    render: function (posts) {
        var post_id = null;

        if (posts) {
            for (let post of posts)
            {
                if (post_id != post.post_id) {
                    post_id = post.post_id;
                    templatesFactory['renderPost'](post);
                }

                if (post.comment_id) {
                    templatesFactory['renderComment'](post);
                }
            }
        }
        else{
            templatesFactory['renderPost'](welcomePost);
        }
    }
};

var validationFunctions = {
    escapeHtml: function (text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    urlifyText: function (text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function(url) {
            return '<a href="' + url + '">' + url + '</a>';
        })
    }
};

var ajaxFactory = {
    getPosts: function () {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                templatesFactory['render'](JSON.parse(xhttp.responseText));
            }
        };

        xhttp.open("GET", "GetPosts.php", true);
        xhttp.send();
    },
    insertPost: function (postJson) {
        var data = JSON.stringify(postJson);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "InsertPost.php");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                popupsFactory['popupHandler']();

                var resultData = JSON.parse(xhttp.responseText);

                var obj = {
                    "post_id": resultData[0].post_id,
                    "post_title": resultData[0].post_title,
                    "post_description": resultData[0].post_description,
                    "post_owner": resultData[0].post_owner,
                    "post_date": resultData[0].post_date
                };

                templatesFactory['renderPost'](obj);
            }
        };

        xhttp.send(data);
    },
    insertComment: function (commentJson) {
        var data = JSON.stringify(commentJson);

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "InsertComment.php");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                popupsFactory['popupHandler']();

                var resultData = JSON.parse(xhttp.responseText);

                var obj = {
                    "post_id": resultData[0].post_id,
                    "comment_description": resultData[0].comment_description,
                    "comment_user": resultData[0].comment_user,
                    "comment_date": resultData[0].comment_date
                };

                templatesFactory['renderComment'](obj);
            }
        };

        xhttp.send(data);
    }
};

var popupsFactory = {
    toggleElement: function (element) {

        if ( element.style.display == 'none' )
        {
            element.style.display = '';
        }
        else
        {
            element.style.display = 'none';
        }

    },
    popupHandler: function () {
        var popup = document.getElementById('popup');
        popupsFactory['toggleElement'](popup);
        var overlay = document.getElementById('fade');
        popupsFactory['toggleElement'](overlay);
    },
    newPost: function () {
        popupsFactory['popupHandler']();

        var popup = document.getElementById('popup_content');

        popup.innerHTML = '';

        var postHeader = document.createElement("h2");
        postHeader.innerHTML = 'Add a post';

        popup.appendChild(postHeader);

        var postTitleField = document.createElement("input");
        postTitleField.setAttribute("type", "text");
        postTitleField.setAttribute('id', "title");
        postTitleField.setAttribute("size", "100");
        postTitleField.setAttribute("max", "100");
        postTitleField.setAttribute("placeholder", "title");

        popup.appendChild(postTitleField);

        var postDescriptionField = document.createElement("textarea");
        postDescriptionField.setAttribute('id', "description");
        postDescriptionField.setAttribute("placeholder", "description");
        postDescriptionField.setAttribute('rows', "5");
        postDescriptionField.setAttribute('cols', "97");

        popup.appendChild(postDescriptionField);

        var postCaptchaField = document.createElement("input");
        postCaptchaField.setAttribute("type", "text");
        postCaptchaField.setAttribute('id', "captcha");
        postCaptchaField.setAttribute("size", "10");
        postCaptchaField.setAttribute("max", "10");
        postCaptchaField.setAttribute("placeholder", "captcha");

        popup.appendChild(postCaptchaField);

        var postSubmitBt = document.createElement("input");
        postSubmitBt.setAttribute("type", "submit");
        postSubmitBt.setAttribute('id', "submit");

        popup.appendChild(postSubmitBt);

        var postSubmitBtHandler = document.getElementById('submit');
        postSubmitBtHandler.onclick = function() {
            var formCaptcha = document.getElementById('captcha');
            if (formCaptcha.value)
            {
                alert("Invalid Form!");
                return false;
            }

            var title = document.getElementById('title');
            if (title.value == null || title.value == "") {
                title.focus();
                return false;
            }

            var description = document.getElementById('description');
            if (description.value == null || description.value == "") {
                description.focus();
                return false;
            }

            var titleValue = validationFunctions['escapeHtml'](title.value);
            var descriptionValue = validationFunctions['escapeHtml'](description.value);

            var post2Insert = {
                "post_title": titleValue,
                "post_description": descriptionValue
            };

            ajaxFactory['insertPost'](post2Insert);

            return false;
        }
    },
    newComment: function (addBt) {
        var postId = addBt.getAttribute("data-post");

        popupsFactory['popupHandler']();

        var popup = document.getElementById('popup_content');

        popup.innerHTML = '';

        var commentHeader = document.createElement("h2");
        commentHeader.innerHTML = 'Add a comment';

        popup.appendChild(commentHeader);

        var commentDescriptionField = document.createElement("textarea");
        commentDescriptionField.setAttribute('id', "description");
        commentDescriptionField.setAttribute("placeholder", "comment");
        commentDescriptionField.setAttribute('rows', "5");
        commentDescriptionField.setAttribute('cols', "97");

        popup.appendChild(commentDescriptionField);

        var commentCaptchaField = document.createElement("input");
        commentCaptchaField.setAttribute("type", "text");
        commentCaptchaField.setAttribute('id', "captcha");
        commentCaptchaField.setAttribute("size", "10");
        commentCaptchaField.setAttribute("max", "10");
        commentCaptchaField.setAttribute("placeholder", "captcha");

        popup.appendChild(commentCaptchaField);

        var commentSubmitBt = document.createElement("input");
        commentSubmitBt.setAttribute('id', "submit");
        commentSubmitBt.setAttribute("type", "submit");
        commentSubmitBt.setAttribute('data-post', postId);

        popup.appendChild(commentSubmitBt);

        var commentSubmitBtHandler = document.getElementById('submit');
        commentSubmitBtHandler.onclick = function() {
            var formCaptcha = document.getElementById('captcha');

            if (formCaptcha.value)
            {
                alert("Invalid Form!");
                return false;
            }

            var description = document.getElementById('description');
            if (description.value == null || description.value == "") {
                description.focus();
                return false;
            }

            var descriptionValue = validationFunctions['escapeHtml'](description.value);

            //var postId = this.getAttribute("data-post");

            var comment2Insert = {
                "post_id": postId,
                "comment_description": descriptionValue
            };

            ajaxFactory['insertComment'](comment2Insert);

            return false;
        }
    },
}

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