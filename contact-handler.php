<?php
// Receives the Chapter 03 contact form. Answers JSON to fetch() and falls back to a redirect without JavaScript.
require __DIR__ . '/includes/contact-lib.php';

$json = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function contact_finish(bool $json, string $code, int $http = 200): void {
    if ($json) {
        http_response_code($http);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $code === 'sent', 'code' => $code, 'message' => contact_message($code)]);
    } else {
        header('Location: ' . contact_base() . '?contact=' . $code . '#contact-form');
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Location: ' . contact_base()); exit; }

// Same-origin only
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $oh = parse_url($origin, PHP_URL_HOST);
    $hh = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    if (!$oh || strcasecmp($oh, $hh) !== 0) contact_finish($json, 'invalid', 403);
}

// Honeypot: real visitors never fill this in; bots get a fake "sent"
if (trim((string) ($_POST['website'] ?? '')) !== '') contact_finish($json, 'sent');

if (!contact_token_ok((string) ($_POST['t'] ?? ''))) contact_finish($json, 'expired', 400);

$name    = trim(preg_replace('/[\r\n\t]+/', ' ', (string) ($_POST['name'] ?? '')));
$email   = trim((string) ($_POST['email'] ?? ''));
$message = trim(str_replace("\r", '', (string) ($_POST['message'] ?? '')));

$len = function ($s) { return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s); };
if ($name === '' || $len($name) > 80 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 120 || preg_match('/[\r\n]/', $email) ||
    $len($message) < 10 || $len($message) > 2000) {
    contact_finish($json, 'invalid', 422);
}

$host    = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['SERVER_NAME'] ?? 'localhost');
$subject = '=?UTF-8?B?' . base64_encode('Portfolio message from ' . $name) . '?=';
$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Portfolio Contact <no-reply@' . $host . '>',
    'Reply-To: ' . $email,
]);
$body = "Name: $name\nEmail: $email\n\n$message\n";

contact_finish($json, @mail(CONTACT_TO, $subject, $body, $headers) ? 'sent' : 'failed', 200);
