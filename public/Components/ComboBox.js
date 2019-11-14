const html = raw => raw[0], css = html
export default class ComboBox {

  constructor (el) {
    el.innerHTML = this.render()
    this.styleUp()

    add.onclick = cancel.onclick =()=>
      document.querySelectorAll('.combo-select>div')
        .forEach(div => div.classList.toggle('active'))

  }

  render() {
    return html`
      <div class="cs-input">
        <input>
        <button>Save</button>
        <button id='cancel'>Cancel</button>
      </div>

      <div class="cs-select active">
        <select>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
        <button>Remove</button>
        <button id='add'>Add</button>
      </div> `
  }

  styleUp() {
    if (document.querySelector('#combo-select-style')) return
    const style = document.createElement('style')
    style.id = 'combo-select-style'
    style.innerHTML = css`
      .combo-select input, .combo-select select {
        width: 200px;
        height: 2rem;
        padding: .3rem;
        box-sizing: border-box;
      }
      .combo-select>div:not(.active) {
        display: none;
      } `
    document.head.append(style)
  }
}