import React, { Component } from 'react';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';
import { connect } from 'react-redux';
import { loginUser } from '../../redux/auth/auth.actions';
import { withRouter } from 'react-router-dom';

class LogIn extends Component {
  state = {
    username: '',
    password: '',
    errors: {
      blankfield: false
    }
  };

  componentDidMount() {
    if (this.props.isAuthenticated) this.props.history.push('/dashboard');
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        blankfield: false
      }
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    this.props.dispatch(
      loginUser(this.props.history, this.state.username, this.state.password)
    );
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove('is-danger');
  };

  render() {
    return (
      <section className='section auth'>
        <div className='container'>
          <h1>Log in</h1>
          <FormErrors
            formerrors={{
              ...this.state.errors,
              cognito: this.props.cognitoErrors
            }}
          />

          <form onSubmit={this.handleSubmit}>
            <div className='field'>
              <p className='control'>
                <input
                  className='input'
                  type='text'
                  id='username'
                  aria-describedby='usernameHelp'
                  placeholder='Enter username or email'
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className='field'>
              <p className='control has-icons-left'>
                <input
                  className='input'
                  type='password'
                  id='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className='icon is-small is-left'>
                  <i className='fas fa-lock'></i>
                </span>
              </p>
            </div>
            <div className='field'>
              <p className='control'>
                <a href='/forgotpassword'>Forgot password?</a>
              </p>
            </div>
            <div className='field'>
              <p className='control'>
                <button
                  className={`button is-success ${
                    this.props.isAuthenticating ? 'is-loading' : ''
                  }`}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isAuthenticating: state.auth.isAuthenticating,
  cognitoErrors: state.auth.error
});

export default withRouter(connect(mapStateToProps)(LogIn));
