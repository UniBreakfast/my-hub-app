const html = raw => raw[0], css = html
const d = document
const { assign } = Object, c = console.log
const credom = (el,...props) => assign(d.createElement(el),...props)
Element.prototype.qsel = d.qsel =
  function (sel, one) { return this[`querySelector${one?'':'All'}`](sel) }



export default class ComboBox {

  constructor (domel, crud) {
    this.domel = domel
    this.render()
    this.styleUp()
    if (crud) this.crudUp(crud)
    this.init()
  }

  add =()=> assign(this.input, {id: '', value: ''}) && this.toggle()

  edit =()=> {
    const { input, select, toggle } = this
    assign(input,
      {id: select.value, value: select.options[select.selectedIndex].text})
    toggle()
  }

  toggle =()=>
    this.domel.qsel('div').forEach(div => div.classList.toggle('active'))

  save =()=> {
    const { input, select } = this
    if (!input.value.trim()) return
    if (input.id) {
      this.update(input.id, input.value).then(record => {
        this.records.push(record)
      })
    }
  }

  crudUp([create, read, update, delit]) {
    assign(this, {create, read, update, delit})
    this.refresh()
  }

  refresh() {
    if (this.read) this.read()
      .then(records => this.fillSelect(this.records = records))
      .catch(err => c(err) || setTimeout(()=>this.refresh(), 1000))
  }

  fillSelect(records) {
    this.select.innerHTML = records.reduce((html, {id, option}) =>
      html+`<option value=${id}>${option}</option>`, '')
  }

  init() { c('no init procedure') }

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
    assign(this, {input, select, add, edit, remove, save, cancel})
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