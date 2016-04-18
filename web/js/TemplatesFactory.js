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

        container.insertBefore(newContent, container.firstChild);
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

        //postContainer.appendChild(newComment);
        postContainer.insertBefore(newComment, postContainer.children[1]);
    },
    render: function (posts) {
        var post_id = null;

        if (posts.length > 0) {
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
