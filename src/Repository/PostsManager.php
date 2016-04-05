<?php
include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    'DBWrapper.php';

class PostsManager
{
    private $dbWrapper;

    public function __construct()
    {
        $this->dbWrapper = new DBWrapper;
    }

    public function getPostById($postId)
    {
        $query = '
SELECT p.post_id,
p.post_title,
p.post_description,
up.user_email AS post_owner,
p.post_date
FROM posts p
JOIN users up ON p.user_id = up.user_id
WHERE p.post_id = ?;';

        $params[] = $postId;

        return $this->dbWrapper->findQuery($query, $params);
    }

    public function getPosts()
    {
        $query = '
SELECT p.post_id,
p.post_title,
p.post_description,
up.user_email AS post_owner,
p.post_date,
c.comment_id,
c.comment_description,
uc.user_email AS comment_user,
c.comment_date
FROM posts p
JOIN users up ON p.user_id = up.user_id
LEFT JOIN comments c ON p.post_id = c.post_id
LEFT JOIN users uc ON c.user_id = uc.user_id
ORDER BY post_date, comment_date DESC;';

        return $this->dbWrapper->findQuery($query);
    }

    public function addPost($data)
    {
        $data['user_id'] = 3;
        return $this->dbWrapper->persist("posts", $data);
    }

    public function getCommentById($commentId)
    {
        $query = '
SELECT c.comment_id,
c.post_id,
c.comment_description,
u.user_email AS comment_user,
c.comment_date
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.comment_id = ?;';

        $params[] = $commentId;

        return $this->dbWrapper->findQuery($query, $params);
    }

    public function addComment($data)
    {
        $data['user_id'] = 5;
        return $this->dbWrapper->persist("comments", $data);
    }

    public function getLastInsertedId()
    {
        return $this->dbWrapper->lastID();
    }
}
