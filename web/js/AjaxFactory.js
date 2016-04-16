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
