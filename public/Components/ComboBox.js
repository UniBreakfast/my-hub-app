const html = raw => raw[0], css = html
const d = document
const { assign } = Object
const credom = (el,...props) => assign(d.createElement(el),...props)
Element.prototype.qsel = d.qsel =
  function (sel, one) { return this[`querySelector${one?'':'All'}`](sel) }



export default class ComboBox {

  constructor (domel) {
    this.domel = domel
    this.render()
    // domel.innerHTML = this.render()
    this.styleUp()

    // add.onclick = cancel.onclick =()=>
    //   document.querySelectorAll('.combo-select>div')
    //     .forEach(div => div.classList.toggle('active'))

  }

  render() {
    const [ [ div1, input ], [ div2, select ] ] = ['input', 'select']
      .map(tag => [credom('div', {className: 'cs-'+tag}), credom(tag)])
    const [ save, cancel, remove, add ] = ['Save', 'Cancel', 'Remove', 'Add']
      .map(innerText => credom('button', {innerText}))
    !['Volvo','Saab','Mercedes','Audi'].forEach(value =>
      select.append(credom('option', {value, innerText:value})))
    ![[div1, input,' ',save,' ',cancel], [div2, select,' ',remove,' ',add],
      [this.domel,div1,div2]].forEach(([domel,...kids])=> domel.append(...kids))
    div1.classList.add('active')
  }

  styleUp() {
    const id = 'combo-select-css'
    if (d.qsel('#'+id, 1)) return
    d.head.append(credom('style', {id, innerHTML: css`
      .combo-select input, .combo-select select {
        width: 200px;
        height: 2rem;
        padding: .3rem;
        box-sizing: border-box;
      }
      .combo-select>div:not(.active) { display: none } `
    }))
  }
}