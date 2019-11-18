const html = raw => raw[0], css = html
const d = document
const { assign } = Object, c = console.log
const credom = (el,...props) => assign(d.createElement(el),...props)
const jsonClone = obj => JSON.parse(JSON.stringify(obj))
Element.prototype.qsel = d.qsel =
  function (sel, one) { return this[`querySelector${one?'':'All'}`](sel) }

const optionHTML = (id, str)=> `<option value=${id}>${str}</option>`

export default class ComboBox {

  constructor (domel, crud) {
    this.domel = domel
    this.render()
    this.styleUp()
    if (crud) this.crudUp(crud)
    this.assignHandlers()
  }

  switchTo(mode) { // 0 - select, 1 - input
    this.domel.qsel('.cs-input',1).classList[mode? 'add':'remove']('active')
    this.domel.qsel('.cs-select',1).classList[!mode? 'add':'remove']('active')
  }



  // add =()=> assign(this.input, {id: '', value: ''}) && this.toggle()

  // edit =()=> {
  //   const { input, select, toggle } = this
  //   assign(input,
  //     {id: select.value, value: select.options[select.selectedIndex].text})
  //   toggle()
  // }

  // toggle =()=>
  //   this.domel.qsel('div').forEach(div => div.classList.toggle('active'))

  // save =()=> {
  //   const { input, select } = this
  //   if (!input.value.trim()) return
  //   if (input.id) {
  //     this.update(input.id, input.value).then(record => {
  //       this.records.push(record)
  //     })
  //   }
  // }

  crudUp([create, read, update, delit]) {
    assign(this, {create, read, update, delit})
    this.refresh()
  }

  refresh() {
    if (this.read) this.read()
      .then(records => this.optionsMake(this.cache = records, true))
      .catch(err => c(err) || setTimeout(()=>this.refresh(), 1000))
  }

  optionsMake(records, unselected) {
    this.select.innerHTML =
      records.reduce((html, {id, option}) => html+optionHTML(id, option),
        unselected? `<option value>... nothing selected ...</option>`:'')
    this.select.dispatchEvent(new Event('change'))
  }

  optionsClear() {
    const unselected = [...this.select].find(option => !option.value)
    this.select.innerHTML = ''
    if (unselected) this.select.add(unselected)
  }

  optionsSort(byText, desc) {
    const unselected = [...this.select].find(option => !option.value),
          part = byText? 'text':'value', dir = desc? -1 : 1
    this.optionRemove('')
    const allNums = [...this.select].every(opt => opt[part]==Number(opt[part])),
          sorter = allNums? (a,b)=> (a[part]-b[part])*dir
            : (a,b)=> a[part]>b[part]? 1*dir: -1*dir
    this.select.append(unselected,...[...this.select].sort(sorter))
  }

  get length() { return this.select.length }

  optionIsPresent(opt) {
    return [...this.select].some(option => option.text==opt)
  }

  optionAdd({id, option}) {
    if (this.optionIsPresent(option)) throw 'conflicting option'
    this.select.add(credom('option', {value: id, text: option}))
  }

  optionRemove(id) {
    this.select.remove([...this.select].findIndex(option => option.value==id))
  }

  optionUpdate({id, option}) {
    [...this.select].find(option => option.value==id).text = option
  }

  optionSelect(id='') { this.select.value = id }

  cacheIt(records) { this.cache = jsonClone(records) }

  cacheHas({id, option}) {
    return this.cache.some(pair => pair.id==id || pair.option==option)
  }

  cacheInclude({id, option}) {
    if (this.cacheHas({id, option})) throw 'conflicting option'
    this.cache.push({id, option})
  }

  cacheExclude(id) {
    this.cache.splice(this.cache.findIndex(pair => pair.id==id), 1)
  }

  cacheUpdate(id, option) {
    this.cache.find(pair => pair.id==id).option = option
  }

  cacheSort(byOption, desc) {
    const part = byOption? 'option':'id', dir = desc? -1 : 1,
          allNums = this.cache.every(opt => opt[part]==Number(opt[part])),
          sorter = allNums? (a,b)=> (a[part]-b[part])*dir
            : (a,b)=> a[part]>b[part]? 1*dir: -1*dir
    this.cache.sort(sorter)
  }

  inputClear() { this.input.id = this.input.value = '' }

  inputSet({id, option}) {
    assign(this.input, {id, value: option})
  }

  inputGet() {
    return {id: this.input.id, value: this.input.value}
  }

  selectedGet() {
    const { value, text } = this.select.selectedOptions[0]
    return {id: value, option: text}
  }

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
    // ![[cancel,'toggle'],[add,'add'],[edit,'edit']]
    //   .map(([btn, method]) => btn.onclick = this[method])
    div2.classList.add('active')
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

  assignHandlers() {
    this.select.addEventListener('change', ()=> ['remove','edit'].map(btn =>
      this[btn].disabled = this.select.value? false : true))
    this.remove.addEventListener('click', ()=> {})
  }
}