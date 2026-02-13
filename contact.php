<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Method not allowed");
}

header("Content-Type: text/plain; charset=UTF-8");

function clean_text($value)
{
    return trim(strip_tags((string) $value));
}

function clean_header_value($value)
{
    return str_replace(["\r", "\n"], "", (string) $value);
}

$firstName = clean_text($_POST['firstName'] ?? '');
$lastName  = clean_text($_POST['lastName'] ?? '');
$emailRaw  = clean_header_value($_POST['email'] ?? '');
$email     = filter_var($emailRaw, FILTER_VALIDATE_EMAIL);
$phone     = clean_text($_POST['phone'] ?? '');
$interest  = clean_text($_POST['interest'] ?? '');
$message   = clean_text($_POST['message'] ?? '');

// Validate required fields
if (!$firstName || !$lastName || !$email || !$interest || !$message) {
    http_response_code(400);
    exit("Bitte alle Pflichtfelder ausfüllen.");
}

$to = "info@slavagroup-ewiv.com";
$subject = "Neue Kontaktanfrage von {$firstName} {$lastName}";
$encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
$fromAddress = "info@slavagroup-ewiv.com";

$body = "Neue Anfrage über Website:

Vorname: $firstName
Nachname: $lastName
E-Mail: $email
Telefon: $phone
Interesse: $interest

Nachricht:
$message
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "From: Slava Group <{$fromAddress}>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$mailSent = @mail($to, $encodedSubject, $body, $headers, "-f{$fromAddress}");
if (!$mailSent) {
    $mailSent = @mail($to, $encodedSubject, $body, $headers);
}

if ($mailSent) {
    echo "success";
} else {
    http_response_code(500);
    error_log("contact.php: mail() failed");
    echo "Fehler beim Senden. Mailserver nicht verfügbar.";
}
