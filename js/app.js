const module = document.querySelector("[data-module='content-block-editor']")

const contentBlockData = {
  "dd28da7a-38f5-4d6a-9d4c-10291dd2c939": {
    "name": "Rate 1",
    "type": "Pension Rate",
    "value": "£122.11"
  },
  "91cc3c43-03fb-4d60-8128-dcb088915f33": {
    "name": "Rate 1",
    "type": "Pension Rate",
    "value": "£400.00"
  }
}

if (module) {
  const wrapper = document.createElement('div');
  wrapper.classList.add("js-content-block-editor-wrapper")
  module.parentNode.insertBefore(wrapper, module);
  wrapper.appendChild(module);

  const overlay = document.createElement("div");
  overlay.classList.add("govuk-textarea")
  overlay.classList.add("js-content-block-editor-overlay")
  overlay.ariaHidden = "true"
  module.after(overlay)

  module.classList.add("js-content-block-editor-textarea")

  function sync_scroll(event) {
    overlay.scrollTop = event.target.scrollTop;
    overlay.scrollLeft = event.target.scrollLeft;
  }

  function populateOverlay(element) {
    let text = element.value
    if(text[text.length-1] === "\n") {
      text += " ";
    }

    const regex = new RegExp("{{embed:content_block_pension:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})}}", "g")
    const foundItems = text.matchAll(regex) || []

    foundItems.forEach(function (item) {
      const uuid = item[1]

      const highlight = document.createElement('span');
      highlight.dataset['value'] = contentBlockData[uuid].value
      highlight.innerText = item[0]
      highlight.classList.add("embedded")

      text = text.replaceAll(item[0], highlight.outerHTML)
    })

    overlay.innerHTML = text
  }

  populateOverlay(module)

  module.addEventListener('scroll', sync_scroll)

  module.addEventListener('input', function (e) {
    populateOverlay(e.target)
    sync_scroll(e)
  })
}
