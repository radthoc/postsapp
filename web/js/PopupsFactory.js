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
