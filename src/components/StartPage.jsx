import React from 'react';
import { Link } from 'react-router-dom';

const StartPage = () => {
    return (
        <div>
            <h1 >Welcome to my App!</h1>
            <p className='option'>Choose an option below:</p>
            <div className='btn-1'>
            <Link to="/login">
                <button>Login</button>
            </Link>
            </div>
            <div className='btn-2'>
            <Link to="/register">
                <button>Register</button>
            </Link>
            </div>
        </div>
    );
};

export default StartPage;
