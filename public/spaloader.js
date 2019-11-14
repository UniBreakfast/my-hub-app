const html = raw => raw[0]

import ComboBox from './Components/ComboBox.js'

document.body.innerHTML += html`<h2>Added via JS</h2>`

document.querySelectorAll('.combo-select').forEach(div => new ComboBox(div))

Object.defineProperty(Object.prototype, 'c', {
  get() {
    console.log(new Date().toLocaleTimeString(), this,
      this instanceof Node? {dir: this}: '')
    return this
  }
})
