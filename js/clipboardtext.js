/*
Clipboard API

Copy text from the content of a DOM selector or text in the data-copy attribute:

  <button
    data-copy="selector|text"
    data-done="copy sucessful"
  >copy</button>

Paste text content into a DOM selector:

  <button
    data-paste="selector"
    data-done="paste sucessful"
  >paste</button>

Buttons will automatically initialize on page load.
Call init() to initialize again if necessary
*/


// configuration
const
  activeClass = { copy: 'copyactive', paste: 'pasteactive' },
  doneMessage = { copy: 'copied', paste: 'pasted' },
  doneClass   = 'done';


// initialize
window && window.addEventListener('DOMContentLoaded', init);

function init() {

  const body = document && document.body;

  // clipboard API available?
  if (!body || !navigator.clipboard) return;

  // text copy active
  if (navigator.clipboard.writeText) body.classList.add(activeClass.copy);

  // text paste active
  if (navigator.clipboard.readText) body.classList.add(activeClass.paste);

  // copy/paste handler
  body.addEventListener('click', clipboardHandler);

}


// copy or paste clicked?
async function clipboardHandler(e) {

  // get clicked element
  const
    target  = e.target,
    type    = (undefined === target.dataset.paste ? 'copy' : 'paste'),
    content = target.dataset[type];

  if (undefined === content) return;

  // is CSS selector?
  let select;
  try {
    select = content && document.querySelector(content);
  }
  catch (error) {}

  // call copy or paste handler
  const handler = { copy, paste };
  if (!await handler[type]( select, content )) return;

  // show success message
  if (!target.dataset.done) target.dataset.done = doneMessage[type];

  target.addEventListener('animationend', () => target.classList.remove(doneClass), { once: true });
  target.classList.add(doneClass);

}


// copy to clipboard
async function copy(select, content) {

  // get text
  const copytext = select ? select.value || select.innerText : content;

  try {

    await navigator.clipboard.writeText(copytext);
    return true;

  }
  catch (error) {
    console.log('copy error', error);
  }

}


// paste handler
async function paste(select) {

  if (!select) return;

  // paste from clipboard
  try {

    const pastetext = await navigator.clipboard.readText();

    if (undefined === select.value) {
      select.innerText += pastetext;
    }
    else {
      select.value += pastetext;
    }

    return true;

  }
  catch (error) {
    console.log('paste error', error);
  }

}