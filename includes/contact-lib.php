<?php
// Shared by index.php (form) and contact-handler.php (sender). No sessions or cookies are used.
const CONTACT_TO = 'jerwincarida06@gmail.com';

// Signed timestamp token: stops simple bots (too fast / forged / stale) without needing a cookie.
function contact_secret(): string {
    return hash('sha256', __DIR__ . '|portfolio-contact|' . (getenv('CONTACT_SECRET') ?: ''));
}
function contact_token(): string {
    $t = (string) time();
    return $t . '.' . hash_hmac('sha256', $t, contact_secret());
}
function contact_token_ok(string $tok): bool {
    $p = explode('.', $tok, 2);
    if (count($p) !== 2 || !ctype_digit($p[0])) return false;
    if (!hash_equals(hash_hmac('sha256', $p[0], contact_secret()), $p[1])) return false;
    $age = time() - (int) $p[0];
    return $age >= 3 && $age <= 7200;          // at least 3 s to fill in, token valid for 2 h
}
function contact_base(): string {              // root-relative path to the folder holding index.php
    $b = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    return $b . '/';
}
function contact_message(string $code): string {
    $m = [
        'sent'    => 'Message sent. Thank you! I will get back to you soon.',
        'invalid' => 'Please enter your name, a valid email, and a message of at least 10 characters.',
        'expired' => 'This form expired. Please reload the page and try again.',
        'failed'  => 'The message could not be sent from the server. Please email ' . CONTACT_TO . ' instead.',
    ];
    return $m[$code] ?? '';
}
