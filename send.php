<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

$config = require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if (!$name || !$email) {
        exit('Name and Email/Phone are required.');
    }

    $mail = new PHPMailer(true);

//     echo '<pre>';
// print_r($_FILES);
// echo '</pre>';
// exit;

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $config['email_user'];
        $mail->Password = $config['email_pass']; // Твій пароль або app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom($config['email_user'], 'Form from site');

        $mail->addAddress($config['email_user']);

        $mail->isHTML(true);
        $mail->Subject = 'New Message from Site';

        $body = "<h2>New Request</h2>
                 <p><b>Full Name:</b> {$name}</p>
                 <p><b>Contacts:</b> {$email}</p>";

        // Додаємо прикріплені файли
        if (!empty($_FILES['files']['name'][0])) {
            $body .= "<p><b>Added files:</b></p><ul>";

            foreach ($_FILES['files']['tmp_name'] as $index => $tmpName) {
                $fileName = $_FILES['files']['name'][$index];

                if (is_uploaded_file($tmpName)) {
                    $mail->addAttachment($tmpName, $fileName);
                    $body .= "<li>{$fileName}</li>";
                } else {
                    $body .= "<li>{$fileName} — failed to upload</li>";
                }
            }

            $body .= "</ul>";
        } else {
            $body .= "<p>Files not added.</p>";
        }
        session_start();
if (!empty($_SESSION['last_sent']) && time() - $_SESSION['last_sent'] < 10) {
    exit('Please wait a few seconds before resubmitting.');
}
$_SESSION['last_sent'] = time();

        $mail->Body = $body;

        $mail->send();

        echo "Thank you, your request was sent. We will call you soon!";
    } catch (Exception $e) {
        echo "Something went wrong: {$mail->ErrorInfo}";
    }
} else {
    echo "No data to send.";
}
