import React from 'react';
import './signUp.css';

function SignUp() {
    return (
        <div className='signUpForm'>
            <div className='leftsignup'>
                <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXdmMTh1dDZ3bjB6dHlzZmpkeWd2cmEwbmUzcXlnbDR1MmhyOGs2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTk9ZwzuWiyJ8n5Vzq/giphy.gif" alt="Sign Up" className="signUpGif" />
            </div>
            <div className='right'>
                <div className='headersignup'>
                    <h3>Create Account</h3>
                </div>
                <form className="signUpFormInputssignup" action="">
                    <div className='inputs'>
                        <div className='namex'>
                            <input type="text" className='name' placeholder='Name'/>
                        </div>
                        <div className='emailx'>
                            <input type="text" className='emailInput' placeholder='Email'/>
                        </div>
                        <div className='phonex'>
                            <input type="text" className='phone' placeholder='Phone number'/>
                        </div>
                        <div className='passwordx'>
                            <input type="password" className='passwordInput' placeholder='Password'/>
                        </div>
                    </div>
                    <div className='signUpSubmit'>
                        <button className='submitButton'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
