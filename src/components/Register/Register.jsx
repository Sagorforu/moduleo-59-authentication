import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../../assets/firebase.config';
import { Link } from 'react-router-dom';


const auth = getAuth(app);

const Register = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleEmailChange = (event) => {
        // setEmail(event.target.value)
    }

    const handlePasswordBlur = (event) => {
        // console.log(event.target.value)
    }

    const handleSubmit = (event) => {
        //1. prevent page refresh
        event.preventDefault();
        setSuccess('');
        // 2. Collect from data
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        console.log(name, email, password)
        if(!/(?=.*[A-Z])/.test(password)){
            setError('Please enter at least one uppercase letter')
            return;
        } else if (!/(?=.*[0-9])/.test(password)) {
            setError('Please enter at least 1 numeric character')
            return;
        } else if (password.length<6){
            setError('Please add at least 6 characters in your password')
            return;
        }
        // 3. create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser)
            setError('');
            event.target.reset();
            setSuccess('User has been created successfully')
            emailVerification(loggedUser)
            updateUserData(result.user, name)
        })
        .catch(error => {
            setError(error.message)
        })
    }

    const emailVerification = loggedUser => {
        sendEmailVerification(loggedUser)
        .then(result => {
            // console.log(result)
            alert('Please Verify your email address')
        })
    }

    const updateUserData = (user, name) =>{
        updateProfile( user, {
            displayName: name
        })
        .then(() => {
            console.log('user name updated')
        })
        .catch(error => {
            setError(error.message)
        })
    }

    return (
        <div className='w-25 mx-auto'>
            <h4>Please Register</h4>
            <form onSubmit={handleSubmit}>
                <input className='mb-2 rounded' type="text" name='name' id='name' placeholder='Your name' required/> <br />
                <input className='mb-2 rounded' onChange={handleEmailChange} type="email" name='email' id='email' placeholder='Your Email' required/> <br />
                <input className='mb-2 rounded' onBlur={handlePasswordBlur} type="password" id='password' placeholder='Your Password' name='password' required/> <br />
                <input className='btn btn-primary' type="submit" value="Register" />
            </form>
            <p><small>Already have an account? Please <Link to="/login">Login</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-primary'>{success}</p>
        </div>
    );
};

export default Register;