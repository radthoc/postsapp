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

$post2Insert = json_decode($_REQUEST, true);

$postsManager = new PostsManager;

$result = $postsManager->persist($post2Insert);

echo json_encode($result);