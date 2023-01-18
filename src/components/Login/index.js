import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

export default class Login extends Component {
  state = {userId: '', pin: '', showErrorMsg: false, errorMsg: ''}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangeUserPin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 10})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showErrorMsg: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const apiUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        pin,
      }),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPin = () => {
    const {pin} = this.state
    return (
      <>
        <label htmlFor="pin" className="label">
          PIN
        </label>
        <input
          type="password"
          id="pin"
          placeholder="Enter PIN"
          value={pin}
          onChange={this.onChangeUserPin}
          className="input"
        />
      </>
    )
  }

  renderUserId = () => {
    const {userId} = this.state
    return (
      <>
        <label htmlFor="user-id" className="label">
          User ID
        </label>
        <input
          type="text"
          id="user-id"
          placeholder="Enter User ID"
          value={userId}
          onChange={this.onChangeUserId}
          className="input"
        />
      </>
    )
  }

  render() {
    const {showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-content">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="web-login"
          />
          <form className="form-container" onSubmit={this.submitForm}>
            <h1 className="login-heading">Welcome Back!</h1>
            {this.renderUserId()}
            {this.renderPin()}
            <button type="submit" className="login-btn">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
