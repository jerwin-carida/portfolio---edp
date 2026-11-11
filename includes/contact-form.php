<?php
require_once __DIR__ . '/contact-lib.php';
$cs = $_GET['contact'] ?? '';
$csMsg = contact_message(is_string($cs) ? $cs : '');
?>

<form class="contact-form" id="contact-form"
      method="POST"
      action="https://formspree.io/f/mojyvowg"
      novalidate>

  <p class="mono label">send a message</p>

  <label class="mono" for="cf-name">Name</label>
  <input id="cf-name" name="name" type="text"
         autocomplete="name" required maxlength="80">

  <label class="mono" for="cf-email">Email</label>
  <input id="cf-email" name="email" type="email"
         autocomplete="email" required maxlength="120">

  <label class="mono" for="cf-message">Message</label>
  <textarea id="cf-message" name="message" rows="5"
            required minlength="10" maxlength="2000"></textarea>

  <div class="hp" aria-hidden="true">
    <label>Leave this empty
      <input name="website" type="text" tabindex="-1" autocomplete="off">
    </label>
  </div>

  <button class="btn" type="submit">Send message</button>

  <p class="form-status mono" id="cf-status"
     role="status" aria-live="polite"></p>

</form>