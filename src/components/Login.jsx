import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const csrfResponse = await axios.patch('https://chatify-api.up.railway.app/csrf');
            const csrfToken = csrfResponse.data.csrfToken;

            console.log('CSRF Token:', csrfToken);

            const response = await axios.post('https://chatify-api.up.railway.app/auth/token', {
                username,
                password
            }, {
                headers: {
                    'X-CSRF-Token': csrfToken
                }
            });

            console.log('Login Response:', response.data);

            const { token } = response.data;
            if (!token) {
                console.error('Token is missing from response.');
                setError('Token is missing from response.');
                return;
            }

            const decodedJwt = JSON.parse(atob(token.split('.')[1]));
            console.log('Decoded JWT:', decodedJwt);

            const { id, user: responseUsername, avatar } = decodedJwt;

            login({ token, id, username: responseUsername, avatar, csrfToken });

            localStorage.setItem('token', token);
            localStorage.setItem('id', id);
            localStorage.setItem('username', responseUsername);
            localStorage.setItem('avatar', avatar);
            localStorage.setItem('csrfToken', csrfToken);

            localStorage.setItem('tokenTimestamp', Date.now());

            navigate('/chat');

        } catch (error) {
            console.error('Login Error:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Logga in på ditt konto
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Logga in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Inte en medlem?{' '}
                    <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Registrera dig här
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
