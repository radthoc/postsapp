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

$comment2Insert = json_decode(file_get_contents("php://input"), true);

try {
    $commentId = $postsManager->addComment($comment2Insert);
    //$postsManager->getLastInsertedId();

    $result = $postsManager->getCommentById($commentId);

    $status = true;

} catch (PDOException $e) {
    $status = false;
    $result = $e->getMessage();
} catch (Exception $e) {
    $status = false;
    $result = $e->getMessage();
}

$response = [
    'status' => $status,
    'result' => $result
];

echo json_encode($result);
