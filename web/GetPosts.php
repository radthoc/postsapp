<?php

include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    '..' .
    DIRECTORY_SEPARATOR .
    'src' .
    DIRECTORY_SEPARATOR .
    'Repository' .
    DIRECTORY_SEPARATOR .
    'PostsManager.php';

$postsManager = new PostsManager;

$posts = $postsManager->getPosts();

echo json_encode($posts);
