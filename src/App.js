import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './main.css'
import Web3 from 'web3'
import promisify from 'util.promisify'

class App extends Component {
  constructor (props) {
    super(props)

    // Init
    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
    this.web3 = new Web3(this.web3Provider)

    this.state = {
      loading: true,
      lucky: 'n/a',
      transaction: 'n/a'
    }
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  doAirDrop = async (addNum, subNum) => {
    const accounts = this.web3.eth.accounts
    const sendTransaction = promisify(this.web3.eth.sendTransaction)
    const to = accounts[addNum] //accounts[Math.floor(accounts.length * Math.random())]
    const address = await sendTransaction({
      from: accounts[subNum], //accounts[0],
      to,
      value: 10
    }).catch(console.error)

    this.setState({ lucky: to, transaction: address })
  }

  componentDidMount = async () => {
    // Get some props
    const coinbase = this.web3.eth.coinbase
    const balance = this.web3.eth.getBalance(coinbase).toString()

    // Watch for change
    this.web3.eth.filter('latest').watch(() => {
      const balance = this.web3.eth.getBalance(coinbase).toString()
      this.setState({ balance })
    })

    // Send some ether every second
    //setInterval(this.doAirDrop, 1000)

    this.setState({ loading: false, coinbase, balance })
  }

  showAccount = lucky =>
    this.web3.eth.accounts.map((account, index) => (
      <tr>
        <td>{index}</td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>
          {account}
        </td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>       {this.web3.eth.getBalance(account).toString()}
        </td>
      </tr>
    ))
  
  handleClick = () => {
    var addInput = this.refs.addAccount, subInput = this.refs.subAccount;
    this.doAirDrop(addInput.value, subInput.value)
  }

  render () {
    // Loading
    if (this.state.loading) return <p>loading...</p>

    // Done
    return (
      <div className="page margin">
        <p>coinbase : {this.state.coinbase}</p>
        <p>balance : {this.state.balance}</p>
        
        <div className="table width">
          <table class="ui teal table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Account</th>
                <th>$</th>
              </tr>
            </thead>
            <tbody>
              {this.showAccount(this.state.lucky)}
            </tbody>
          </table>
        </div>

        <div class="ui labeled input">
          <div class="ui label">
            Added ID
          </div>
          <input type="text" placeholder="$+" ref="addAccount" />
        </div>

        <div class="ui labeled input">
          <div class="ui label">
            Subed ID
          </div>
          <input type="text" placeholder="$-" ref="subAccount" />
        </div>

        <button class="ui button" onClick={this.handleClick}>
            Click me   
        </button>

        <p>lucky : {this.state.lucky}</p>
        <p>transaction : {this.state.transaction}</p>
      </div>
    )
  }
}

export default App
