<?php
function handleFileUpload(string $inputName, string $targetDir): ?string
{
    if (!isset($_FILES[$inputName]) || $_FILES[$inputName]['error'] !== UPLOAD_ERR_OK) {
        return ''; // no file uploaded
    }

    $uploadDir = __DIR__ . "/../../public/uploads/$targetDir/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileTmpPath = $_FILES[$inputName]['tmp_name'];
    $fileName = basename($_FILES[$inputName]['name']);
    $fileSize = $_FILES[$inputName]['size'];
    $fileType = mime_content_type($fileTmpPath);

    // Allowed types
    $allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/zip',
        'application/x-zip-compressed',
        'application/octet-stream'
    ];

    // File size limits
    $maxSizeImage = 5 * 1024 * 1024;    // 5 MB
    $maxSizeGame  = 500 * 1024 * 1024;  // 500 MB

    // Decide size limit based on input type
    $isImage = str_starts_with($fileType, 'image/');
    $maxSize = $isImage ? $maxSizeImage : $maxSizeGame;

    // Validate type and size
    if (!in_array($fileType, $allowedTypes) || $fileSize > $maxSize) {
        return null;
    }

    // Generate safe unique filename
    $newFileName = uniqid() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $fileName);
    $destPath = $uploadDir . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        return "/uploads/$targetDir/" . $newFileName; // relative path
    }

    return null;
}

function handleFileUploadMultiple(string $inputName, int $index, string $targetDir): ?string
{
    if (!isset($_FILES[$inputName]) || $_FILES[$inputName]['error'][$index] !== UPLOAD_ERR_OK) {
        return null;
    }

    $uploadDir = __DIR__ . "/../../public/uploads/$targetDir/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileTmpPath = $_FILES[$inputName]['tmp_name'][$index];
    $fileName = basename($_FILES[$inputName]['name'][$index]);
    $fileSize = $_FILES[$inputName]['size'][$index];
    $fileType = mime_content_type($fileTmpPath);

    // Validate file types and sizes
    $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    $maxSize = 50 * 1024 * 1024; // 50MB max

    if (!in_array($fileType, array_merge($allowedImageTypes, $allowedVideoTypes)) || $fileSize > $maxSize) {
        return null;
    }

    $newFileName = uniqid() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $fileName);
    $destPath = $uploadDir . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        return "/uploads/$targetDir/" . $newFileName;
    }

    return null;
}
