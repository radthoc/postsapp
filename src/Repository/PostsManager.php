<?php
include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    'DBWrapper.php';

class PostsManager
{
    private $DBWrapper;

    public function __construct()
    {
        $this->DBWrapper = new DBWrapper;
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

        return $this->DBWrapper->findQuery($query);
    }

    public function persist($data)
    {
        $data['user_id'] = 3;
        return $this->DBWrapper->persist("posts", $data);
    }
}