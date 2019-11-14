const html = raw => raw[0]
const { assign } = Object

import ComboBox from './Components/ComboBox.js'

document.body.innerHTML += html`<h2>Added via JS</h2>`

const [ cb1, cb2 ] =
  [...document.querySelectorAll('.combo-select')].map(div => new ComboBox(div))

Object.defineProperty(Object.prototype, 'c', {
  get() {
    console.log(new Date().toLocaleTimeString(), this,
      this instanceof Node? {dir: this}: '')
    return this
  }
})

assign(window, {cb1, cb2})