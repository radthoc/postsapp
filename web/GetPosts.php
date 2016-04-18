<?php

include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    '..' .
    DIRECTORY_SEPARATOR .
    'src' .
    DIRECTORY_SEPARATOR .
    'Persistence' .
    DIRECTORY_SEPARATOR .
    'MYSQLHandler.php';

include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    '..' .
    DIRECTORY_SEPARATOR .
    'src' .
    DIRECTORY_SEPARATOR .
    'Repository' .
    DIRECTORY_SEPARATOR .
    'DBWrapper.php';

include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    '..' .
    DIRECTORY_SEPARATOR .
    'src' .
    DIRECTORY_SEPARATOR .
    'Repository' .
    DIRECTORY_SEPARATOR .
    'PostsManager.php';

$dBHandler = new MYSQLHandler;
$dBWrapper = new DBWrapper($dBHandler);
$postsManager = new PostsManager($dBWrapper);

$posts = $postsManager->getPosts();

echo json_encode($posts);
