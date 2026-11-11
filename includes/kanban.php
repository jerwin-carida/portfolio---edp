<?php
$cols = [
  ['todo',    'Not Started', 'Tasks pending initial execution'],
  ['pending', 'Pending',     'Tasks currently in progress'],
  ['done',    'Finished',    'Completed tasks and objectives'],
];
?>
<div class="cli-note kanban-note" id="kanban" style="--tilt:0deg">
  <p class="mono label">kanban.html (interactive)</p>

  <form class="kb-add" id="kb-add" autocomplete="off">
    <label class="sr-only" for="kb-input">New task</label>
    <input id="kb-input" type="text" maxlength="80" placeholder="New task for the Cat Government…">
    <button type="submit">Add task</button>
  </form>

  <div class="kb-board" id="kb-board">
    <?php foreach ($cols as [$id, $name, $desc]): ?>
    <section class="kb-col" data-col="<?= $id ?>" aria-labelledby="kb-h-<?= $id ?>">
      <h4 id="kb-h-<?= $id ?>"><?= $name ?> <span class="kb-count" data-count="<?= $id ?>">0</span></h4>
      <p class="mono muted small"><?= $desc ?></p>
      <ul class="kb-list" data-col="<?= $id ?>" aria-label="<?= $name ?> tasks"></ul>
    </section>
    <?php endforeach; ?>
    <div class="kb-indicator" id="kb-ind" aria-hidden="true"></div>
  </div>

  <p class="mono muted small" id="kb-hint">Drag cards between columns, or use the arrow buttons. Saved in this browser.</p>
  <p class="sr-only" role="status" aria-live="polite" id="kb-live"></p>
</div>
