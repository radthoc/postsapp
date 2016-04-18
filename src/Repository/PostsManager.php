<?php

/**
 * Class PostsManager
 */
class PostsManager
{
    /**
     * @var DBWrapper
     */
    private $dBWrapper;

    public function __construct(DBWrapper $dBWrapper)
    {
        $this->dBWrapper = $dBWrapper;
    }

    /**
     * @param $postId
     * @return mixed
     * @throws Exception
     */
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

        return $this->dBWrapper->findQuery($query, $params);
    }

    /**
     * @return mixed
     * @throws Exception
     */
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
LEFT JOIN users uc ON c.user_id = uc.user_id;';

        return $this->dBWrapper->findQuery($query);
    }

    /**
     * @param $data
     * @return mixed
     * @throws Exception
     */
    public function addPost($data)
    {
        $data['user_id'] = 7;
        return $this->dBWrapper->persist("posts", $data);
    }

    /**
     * @param $commentId
     * @return mixed
     * @throws Exception
     */
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

        return $this->dBWrapper->findQuery($query, $params);
    }

    /**
     * @param $data
     * @return mixed
     * @throws Exception
     */
    public function addComment($data)
    {
        $data['user_id'] = 8;
        return $this->dBWrapper->persist("comments", $data);
    }

    /**
     * @return mixed
     */
    public function getLastInsertedId()
    {
        return $this->dBWrapper->lastID();
    }
}
