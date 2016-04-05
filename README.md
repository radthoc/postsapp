Posts App
========

Introduction
-------
App that provides users a platform to publish any post and comment the posts.

Usage
-------
The entry point is the web/posts.html file.

Istallation
-----------
- Checkout the source: git clone git://github.com/radthoc/posts_app.git or dowmload the zip file.
- Execute the db_script sql to create your database using mysql.
- Set the db parameters in the Persistence/MYSQLHandler.php.

Tests
-----
Still in the oven!

Notes
-----
- In order to prevent spams we added a redundant field in the forms hidden through css. Normal users will not be able to see the field, but spambots will try to enter a value into it because they do not process CSS or javascript.
- Since there's no security implemented the user is hardcoded in the creation of posts and comments.
- This site uses no framework or libraries due to special requirements for the test