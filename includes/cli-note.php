<div class="cli-note" id="<?= $cli['id'] ?>" style="--tilt:<?= $cli['tilt'] ?>deg">
  <p class="mono label"><?= $cli['label'] ?></p>
  <div class="cli-out" role="log" aria-live="polite" tabindex="0" aria-label="<?= $cli['label'] ?> output"></div>
  <form class="cli-form" autocomplete="off">
    <label class="mono" for="<?= $cli['id'] ?>-in"><?= $cli['prompt'] ?></label>
    <div class="cli-row">
      <span class="mono" aria-hidden="true">&gt;</span>
      <input id="<?= $cli['id'] ?>-in" class="mono" type="text" inputmode="<?= $cli['mode'] ?>" placeholder="<?= $cli['placeholder'] ?>">
      <button type="submit"><?= $cli['button'] ?></button>
    </div>
  </form>
  <button type="button" class="link-btn mono" data-reset><?= $cli['reset'] ?></button>
</div>
