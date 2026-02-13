<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Method not allowed");
}

// Sanitize inputs
$firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
$lastName  = htmlspecialchars(trim($_POST['lastName'] ?? ''));
$email     = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone     = htmlspecialchars(trim($_POST['phone'] ?? ''));
$interest  = htmlspecialchars(trim($_POST['interest'] ?? ''));
$message   = htmlspecialchars(trim($_POST['message'] ?? ''));

// Validate required fields
if (!$firstName || !$lastName || !$email || !$interest || !$message) {
    http_response_code(400);
    exit("Bitte alle Pflichtfelder ausfüllen.");
}

$to = "info@slavagroup-ewiv.com";
$subject = "Neue Kontaktanfrage von $firstName $lastName";

$body = "
Neue Anfrage über Website:

Vorname: $firstName
Nachname: $lastName
E-Mail: $email
Telefon: $phone
Interesse: $interest

Nachricht:
$message
";

$headers  = "From: info@slavagroup-ewiv.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo "success";
} else {
    http_response_code(500);
    echo "Fehler beim Senden.";
}