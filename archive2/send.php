<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

// Перевірка POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit(json_encode(['status' => 'error', 'message' => 'No data to send.']));
}

// Дані з форми
$name  = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');

if (!$name || !$email) {
    exit(json_encode(['status' => 'error', 'message' => 'Name and Email/Phone are required.']));
}

// Захист від повторної відправки
session_start();
if (!empty($_SESSION['last_sent']) && time() - $_SESSION['last_sent'] < 10) {
    exit(json_encode(['status' => 'error', 'message' => 'Please wait a few seconds before resubmitting.']));
}
$_SESSION['last_sent'] = time();

// SMTP налаштування
$email_user = 'mail@pdrpatrol.ca';
$email_pass = 'M@il123456';
$email_to   = 'sovadimidrol@gmail.com';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $email_user;
    $mail->Password   = $email_pass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($email_user, 'Form from site');
    $mail->addAddress($email_to);

    $mail->isHTML(true);
    $body = "<h2>New Request</h2>
             <p><b>Full Name:</b> {$name}</p>
             <p><b>Contacts:</b> {$email}</p>";

    // Обробка файлів
    if (!empty($_FILES['files']['name'][0])) {
        $body .= "<p><b>Added files:</b></p><ul>";
        $allowedTypes = ['image/jpeg','image/png','application/pdf','video/mp4','video/quicktime','video/webm','video/ogg'];
        
        foreach ($_FILES['files']['tmp_name'] as $i => $tmpName) {
            $fileName = $_FILES['files']['name'][$i];
            $fileSize = $_FILES['files']['size'][$i];
            $fileType = mime_content_type($tmpName);
            $error    = $_FILES['files']['error'][$i];

            if ($error !== UPLOAD_ERR_OK) {
                $body .= "<li>{$fileName} — upload error ({$error})</li>";
                continue;
            }

            if ($fileSize > 5 * 1024 * 1024) {
                $body .= "<li>{$fileName} — skipped (file too large)</li>";
                continue;
            }

            if (!in_array($fileType, $allowedTypes)) {
                $body .= "<li>{$fileName} — skipped (type not allowed)</li>";
                continue;
            }

            if (!is_uploaded_file($tmpName)) {
                $body .= "<li>{$fileName} — skipped (tmp file missing)</li>";
                continue;
            }

            $mail->addAttachment($tmpName, $fileName);
            $body .= "<li>{$fileName}</li>";
        }
        $body .= "</ul>";
    }

    $mail->Body = $body;
    $mail->AltBody = "New Request\nFull Name: {$name}\nContacts: {$email}\nFiles: " 
                    . (!empty($_FILES['files']['name'][0]) ? implode(', ', $_FILES['files']['name']) : 'Not added');

    $mail->send();
    echo json_encode(['status' => 'success', 'message' => 'Thank you, your request was sent. We will call you soon!']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
}
