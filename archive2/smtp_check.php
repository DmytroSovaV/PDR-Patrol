<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

// === Замени на свои данные ===
$email_user = 'mail@pdrpatrol.ca'; // твой email на Hostinger
$email_pass = 'M@il123456';  // пароль или app-password
$email_to   = 'sovadimidrol@gmail.com'; // куда отправить тест

$tests = [
    ['port' => 587, 'secure' => PHPMailer::ENCRYPTION_STARTTLS],
    ['port' => 465, 'secure' => PHPMailer::ENCRYPTION_SMTPS],
];

foreach ($tests as $test) {
    echo "<h2>Проверка: порт {$test['port']} ({$test['secure']})</h2>";

    $mail = new PHPMailer(true);
    try {
        $mail->SMTPDebug = 2; // полный лог
        $mail->Debugoutput = 'html';

        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = $email_user;
        $mail->Password = $email_pass;
        $mail->SMTPSecure = $test['secure'];
        $mail->Port = $test['port'];

        $mail->setFrom($email_user, 'SMTP Test Script');
        $mail->addAddress($email_to);

        $mail->isHTML(true);
        $mail->Subject = "SMTP Test on port {$test['port']}";
        $mail->Body = "<p>This is a <b>test email</b> sent via port {$test['port']}.</p>";

        if ($mail->send()) {
            echo "<p style='color:green'><b>✅ УСПЕХ:</b> письмо отправлено через порт {$test['port']}.</p>";
        } else {
            echo "<p style='color:red'><b>❌ Ошибка:</b> {$mail->ErrorInfo}</p>";
        }
    } catch (Exception $e) {
        echo "<p style='color:red'><b>❌ Исключение:</b> {$mail->ErrorInfo}</p>";
    }

    echo "<hr>";
}
