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
    this.styleUp()

  }

  add =()=> (this.input.value = '', this.toggle())

  edit =()=> (this.input.value = this.select.value, this.toggle())

  toggle =()=>
    this.domel.qsel('div').forEach(div => div.classList.toggle('active'))

  render() {
    const [ [ div1, input ], [ div2, select ] ] = ['input', 'select']
      .map(tag => [credom('div', {className: 'cs-'+tag}), credom(tag)])
    const [ save, cancel, remove, edit, add ] =
      ['Save', 'Cancel', 'Remove', 'Edit', 'Add']
        .map(innerText => credom('button', {innerText}))
    !['Volvo','Saab','Mercedes','Audi'].forEach(value =>
      select.append(credom('option', {value, innerText:value})))
    ![[div1, input, ' ', save, ' ', cancel],
      [div2, select,' ', remove,' ', edit,' ', add], [this.domel, div1, div2]]
        .forEach(([domel,...kids])=> domel.append(...kids))
    ![[cancel,'toggle'],[add,'add'],[edit,'edit']]
      .map(([btn, method]) => btn.onclick = this[method])
    div1.classList.add('active')
    assign(this, {input, select})
  }

  styleUp() {
    const id = 'combo-select-css'
    if (d.qsel('#'+id, 1)) return
    d.head.append(credom('style', {id, innerHTML: css`
      .combo-select input, .combo-select select {
        width: 12rem;
        height: 2rem;
        padding: .3rem;
        box-sizing: border-box;
      }
      .combo-select>div:not(.active) { display: none }
      .cs-input button { padding-left: 1.08rem; padding-right: 1.08rem } `
    }))
  }
}