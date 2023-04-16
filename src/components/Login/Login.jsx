import { getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import app from '../../assets/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app)

const Login = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailRef = useRef();

    const handleSignIn = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        // check validation
        setError('');
        setSuccess('');
        if (!/(?=.*[A-Z])/.test(password)) {
            setError('Please enter at least one upper case')
            return;
        } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
            setError('Please enter at least one special characters')
            return;
        } else if (password.length < 6) {
            setError('Password must be 6 characters long')
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser)
                if (!loggedUser.emailVerified) {
                    alert('Please verify your email. Check your inbox')
                }
                setSuccess('User login successfully');
                setError('');
            })
            .catch(error => {
                setError(error.message)
            })
    }

    const handleResetPassword = event => {
        const email = (emailRef.current.value);
        if (!email) {
            alert('Please type your email')
            return;
        }
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Please reset your password')
        })
        .catch(error => {
            console.log(error)
            setError(error.message)
        })
    }

    return (
        <div>
            <form onSubmit={handleSignIn} className='w-25 mx-auto'>
                <h3>Please Login</h3>
                <div className="form-group mb-3">
                    <label htmlFor="email">Email address</label>
                    <input type="email" ref={emailRef} name='email' required className="form-control" id="email" placeholder="Enter email" />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' required className="form-control" id="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <p><small>Forgot Password? Please<button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button> </small></p>
                <p><small>New to this website. Please <Link to="/register">Register</Link></small></p>
                <p className='text-danger'>{error}</p>
                <p className='text-success'>{success}</p>
            </form>
        </div>
    );
};

export default Login;