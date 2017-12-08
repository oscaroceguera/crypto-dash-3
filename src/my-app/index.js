import { Element } from '@polymer/polymer/polymer-element.js'

import template from './template.html'

export class MyApp extends Element {
  constructor () {
    super()
    this.name = 'Luke'
  }

  static get properties () {
    return {
      name: {
        type: String,
        value: 'Init name',
        observer: 'myNameChange'
      }
    }
  }

   static get template () {
     return template
   }

   myNameChange (name) {
     this.textContent = `Hola! my nombre es ${name}`
   }

}

customElements.define('my-app', MyApp)