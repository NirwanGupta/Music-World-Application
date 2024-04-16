import React from 'react';
import './signUp.css';

function SignUp() {
    return (
        <div className='signUpForm'>
            <div className='left'>
                <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXdmMTh1dDZ3bjB6dHlzZmpkeWd2cmEwbmUzcXlnbDR1MmhyOGs2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTk9ZwzuWiyJ8n5Vzq/giphy.gif" alt="Sign Up" className="signUpGif" />
            </div>
            <div className='right'>
                <div className='header'>
                    <h3>Create Account</h3>
                </div>
                <form className="signUpFormInputs" action="">
                    <div className='inputs'>
                        <div className='name'>
                            <input type="text" className='nameInput' placeholder='Name'/>
                        </div>
                        <div className='email'>
                            <input type="text" className='emailInput' placeholder='Email'/>
                        </div>
                        <div className='phone'>
                            <input type="text" className='phoneInput' placeholder='Phone number'/>
                        </div>
                        <div className='password'>
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
