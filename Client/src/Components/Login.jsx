import React from 'react';
import './Login.css';

function SignUp() {
    return (
        <div className='LoginForm'>
            <div className='left'>
                <div className='header'>
                    <h3> Login </h3>
                </div>
                <form className="signUpFormInputs" action="">
                    <div className='inputs'>
                        <div className='email'>
                            <input type="text" className='emailInput' placeholder='Email'/>
                        </div>
                        <div className='password'>
                            <input type="password" className='passwordInput' placeholder='Password'/>
                        </div>
                    </div>
                    
                    <div className='LoginSubmit'>
                        <button className='submitButton'>Submit</button>
                    </div>
                    <div className='forgotPassword'>
                        <a href="/reset-password" className='forgotPasswordLink'>Forgot Password?</a>
                    </div>
                </form>
            </div>
            <div className='right'>
                <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXdmMTh1dDZ3bjB6dHlzZmpkeWd2cmEwbmUzcXlnbDR1MmhyOGs2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTk9ZwzuWiyJ8n5Vzq/giphy.gif" alt="Sign Up" className="signUpGif" />
            </div>
        </div>
    );
}

export default SignUp;
