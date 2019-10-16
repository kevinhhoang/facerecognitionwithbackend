import React, { Component } from 'react';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value });
    }

    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value });
    }

    onSubmitSignIn = () => {
        fetch('http://localhost:3000/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.id) {
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
        }) 
    }

    render() {
        const { onRouteChange } = this.props;

        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw5 ph0 mh0 white">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw1 lh-copy f6 white" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address" 
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw1 lh-copy f6 white" htmlFor="password">Password</label>
                                <input 
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password"  
                                    id="password" 
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </fieldset>
                        <div className="">
                            <input
                                onClick={this.onSubmitSignIn}
                                // here when we click on the 'Sign in' submit button, we want it to pass the argument 'home' back to the 'routeValue' parameter in 'App.js' so that when the ternary operator checks the condition with 'this.state.route' it verifies with the new route value that we pass it (in this case if we click the sign in button, we pass the value 'home' to route)
                                    // additionally, the reason why we write the function like that instead of {onRouteChange('home') is because we don't want this function to run right away when App gets rendered, we want it to run WHENEVER 'onClick' happens and THEN the 'onClick' will call the function. So we create a function that only executes when the 'onClick' event happens instead of CALLING the function right away
                                        // prior to this.onSubmitSignIn we had {() => onRouteChange('home')}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib white" 
                                type="submit" 
                                value="Sign in" 
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')} className="f6 link dim white db pointer">Register</p>
                            {/* here, if we click on 'Register' we want it to bring us to the Register page */}
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signin;