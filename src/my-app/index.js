import { Element } from '@polymer/polymer/polymer-element.js'
import '@polymer/polymer/lib/elements/dom-repeat'
import axios from 'axios'
import Chart from 'chart.js'
import moment from 'moment'

import template from './template.html'

const BASE_URL = 'https://api.coinbase.com/v2/prices'

export class MyApp extends Element {
  static get properties () {
    return {
      currencies: {
        type: Array,
        value: [
          {
            code: 'BTC',
            name: 'Bitcoin',
            price: 0
          },
          {
            code: 'ETH',
            name: 'Ethereum',
            price: 0
          },
          {
            code: 'LTC',
            name: 'Litecoin',
            price: 0
          }
        ]
      },
      // loading: {
      //   type: Boolean,
      //   notify: true,
      //   value: false
      // },
      myLineChart: {}
    }
  }

  static get template () { return template }

  ready () {
    super.ready()
    this._getCurrencyData()
  }

  async _getCurrencyData () {
    await Promise.all(
      this.currencies.map(async (item, index) => {
        const _data = await axios.get(`${BASE_URL}/${item.code}-USD/spot`).then(response => response.data)
        this.set('currencies.' + index + '.price', _data.data.amount)
      })
    )
  }

  async _getCurrencyHistoricData (currency) {
    if (!!event) {
      currency = event.target.dataset.item
    }

    const _data = await axios.get(`${BASE_URL}/${currency}-USD/historic?period=week`).then(response => response)
    this._computeGraph(_data)
  }

  _computeTime (time) {
    return moment(time, "YYYY-MM-DDThh:mm:aaZ").format('M/DD/YYYY h:mm a')
  }

  _computeGraph (response) {
    let code = response.config.url.substring(35, 38)
    let label = []
    let price = []
    response.data.data.prices.forEach(item => {
      label.push(this._computeTime(item.time))
      price.push(item.price)
    })

    this._generateLineChart(label, price, code)
  }

  _generateLineChart (label, price, labelName) {
    if (this.myLineChart !== undefined) this.myLineChart.destroy()

    let ctx = this.$.canvas.getContext('2d')

    this.myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: label,
        datasets: [
          {
            pointRadius: 0,
            label: labelName,
            backgroundColor: "rgba(111, 124, 186, 0.1)",
            borderColor: "rgba(111, 124, 186, 1)",
            borderWidth: 2,
            data: price
          }
        ]
      },
      options: {
        animation: false,
        tooltips: {
          mode: 'index',
          intersect: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            }
          }]
        }
      }
    })
  }

}

customElements.define('my-app', MyApp)
