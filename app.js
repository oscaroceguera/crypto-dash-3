import { Element as PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js'

import template from './template.html'

export class MyApp extends PolymerElement {
  constructor () {
    super()
    this.name = '3.0.0 preview'
  }

  static get properties () {
    name: {
      type: String
    }
  }

   static get template () {
     return template
   }

}

customElements.define('my-app', MyApp)