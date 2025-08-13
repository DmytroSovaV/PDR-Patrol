<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

$config = require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit("No data to send.");
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');

if (!$name || !$email) {
    exit('Name and Email/Phone are required.');
}

session_start();
if (!empty($_SESSION['last_sent']) && time() - $_SESSION['last_sent'] < 10) {
    exit('Please wait a few seconds before resubmitting.');
}
$_SESSION['last_sent'] = time();

$smtp_options = [
    ['port' => 587, 'secure' => PHPMailer::ENCRYPTION_STARTTLS],
    ['port' => 465, 'secure' => PHPMailer::ENCRYPTION_SMTPS],
];

$mail_sent = false;
$last_error = '';

foreach ($smtp_options as $option) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = $config['email_user'];
        $mail->Password = $config['email_pass'];
        $mail->SMTPSecure = $option['secure'];
        $mail->Port = $option['port'];

        $mail->setFrom($config['email_user'], 'Form from site');
        $mail->addAddress($config['email_to']);

        $mail->isHTML(true);
        $mail->Subject = 'New Message from Site';

        $body = "<h2>New Request</h2>
                 <p><b>Full Name:</b> {$name}</p>
                 <p><b>Contacts:</b> {$email}</p>";

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

        $mail->Body = $body;

        $mail->send();
        $mail_sent = true;
        break; 
    } catch (Exception $e) {
        $last_error = $mail->ErrorInfo;
    }
}

if ($mail_sent) {
    echo "Thank you, your request was sent. We will call you soon!";
} else {
    echo "Something went wrong: {$last_error}";
}
