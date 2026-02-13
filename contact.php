<?php

header("Content-Type: text/plain; charset=UTF-8");

function set_status($code)
{
    $texts = array(
        200 => "OK",
        400 => "Bad Request",
        405 => "Method Not Allowed",
        500 => "Internal Server Error"
    );

    $text = isset($texts[$code]) ? $texts[$code] : "OK";
    header("HTTP/1.1 " . $code . " " . $text);
}

function clean_text($value)
{
    return trim(strip_tags((string)$value));
}

function clean_header_value($value)
{
    return str_replace(array("\r", "\n"), "", (string)$value);
}

if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] !== "POST") {
    set_status(405);
    exit("Method not allowed");
}

$firstName = isset($_POST["firstName"]) ? clean_text($_POST["firstName"]) : "";
$lastName  = isset($_POST["lastName"]) ? clean_text($_POST["lastName"]) : "";
$emailRaw  = isset($_POST["email"]) ? clean_header_value($_POST["email"]) : "";
$email     = filter_var($emailRaw, FILTER_VALIDATE_EMAIL);
$phone     = isset($_POST["phone"]) ? clean_text($_POST["phone"]) : "";
$interest  = isset($_POST["interest"]) ? clean_text($_POST["interest"]) : "";
$message   = isset($_POST["message"]) ? clean_text($_POST["message"]) : "";

if ($firstName === "" || $lastName === "" || !$email || $interest === "" || $message === "") {
    set_status(400);
    exit("Bitte alle Pflichtfelder ausfüllen.");
}

$to = "info@slavagroup-ewiv.com";
$fromAddress = "info@slavagroup-ewiv.com";
$subject = "Neue Kontaktanfrage von " . $firstName . " " . $lastName;
$encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

$body = "Neue Anfrage über Website:\n\n"
    . "Vorname: " . $firstName . "\n"
    . "Nachname: " . $lastName . "\n"
    . "E-Mail: " . $email . "\n"
    . "Telefon: " . $phone . "\n"
    . "Interesse: " . $interest . "\n\n"
    . "Nachricht:\n" . $message . "\n";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "From: Slava Group <" . $fromAddress . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

if (!function_exists("mail")) {
    set_status(500);
    error_log("contact.php: mail() function is disabled");
    echo "Fehler beim Senden. Mailfunktion ist auf dem Server deaktiviert.";
    exit;
}

$mailSent = @mail($to, $encodedSubject, $body, $headers, "-f" . $fromAddress);
if (!$mailSent) {
    $mailSent = @mail($to, $encodedSubject, $body, $headers);
}

if ($mailSent) {
    set_status(200);
    echo "success";
    exit;
}

set_status(500);
error_log("contact.php: mail() failed");
echo "Fehler beim Senden. Mailserver nicht verfügbar.";
