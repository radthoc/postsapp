var TemplatesFactory = {
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

        var newPostDescription = document.createElement('p');
        newPostDescription.setAttribute('class', 'description');
        newPostDescription.innerHTML = postToRender.post_description;

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
        var post_id = 0;

        for (let post of posts)
        {
            if (post_id != post.post_id) {
                post_id = post.post_id;

                TemplatesFactory['renderPost'](post);
            }

            if (post.comment_id) {
                TemplatesFactory['renderComment'](post);
            }
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
    }
};

var ajaxFactory = {
    getPosts: function () {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                TemplatesFactory['render'](JSON.parse(xhttp.responseText));
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

                TemplatesFactory['renderPost'](obj);
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
        postDescriptionField.setAttribute('cols', "100");

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
}

var staticPost = [
    {
        "post_id": 13,
        "post_title": "Este es el primer post dinamico",
        "post_description": "Y asi de esta manera hemos creado un post de manera dinamica. Gracias por la ayuda y colaboracion de todos los implicados en esta ardua labor. Ha sido un gran trabajo de equipo!",
        "post_owner": "yulelpi@baiguate.com",
        "post_date": "15/03/2016 10:23:08",
        "comment_id": 12,
        "comment_description": "ahi es que la puerca tuerce el rabo!",
        "comment_user": "arisquelmi@hotmail.com",
        "comment_date": "16/03/2016 14:08:56"
    },
    {
        "post_id": 13,
        "post_title": "Este es el primer post dinamico",
        "post_description": "Y asi de esta manera hemos creado un post de manera dinamica. Gracias por la ayuda y colaboracion de todos los implicados en esta ardua labor. Ha sido un gran trabajo de equipo!",
        "post_owner": "yulelpi@baiguate.com",
        "post_date": "15/03/2016 10:23:08",
        "comment_id": 14,
        "comment_description": "na eh na, lo que importa es lo que vale!",
        "comment_user": "ancuz@gmail.com",
        "comment_date": "16/03/2016 15:26:33"
    },
    {
        "post_id": 13,
        "post_title": "Este es el primer post dinamico",
        "post_description": "Y asi de esta manera hemos creado un post de manera dinamica. Gracias por la ayuda y colaboracion de todos los implicados en esta ardua labor. Ha sido un gran trabajo de equipo!",
        "post_owner": "yulelpi@baiguate.com",
        "post_date": "15/03/2016 10:23:08",
        "comment_id": 14,
        "comment_description": "ya si fue verda q llegamo como le dijo el tuerto al ciego!",
        "comment_user": "pindaro@hotmail.com",
        "comment_date": "18/03/2016 09:36:22"
    }
];

window.onload = function () {
    //TemplatesFactory['render'](staticPost);

    var newPostBt = document.getElementById('new_post');

    newPostBt.onclick=function(){
        popupsFactory['newPost']();
    };

    var closeBt = document.getElementById('close');

    closeBt.onclick=function(){
        popupsFactory['popupHandler']();
    };

    ajaxFactory['getPosts']();
};