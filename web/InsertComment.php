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

$comment2Insert = json_decode(file_get_contents("php://input"), true);

$postsManager = new PostsManager;

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
