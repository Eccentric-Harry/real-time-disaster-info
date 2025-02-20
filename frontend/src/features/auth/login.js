
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";

const Login = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://disaster-backend-nine.vercel.app/auth/login", { email, password });
            if (res.data?.accessToken) {
                localStorage.setItem("token", res.data.accessToken);
                const userId = JSON.parse(atob(res.data.accessToken.split('.')[1])).UserInfo.userId;
                localStorage.setItem('userId', userId);
                navigate(role === 'admin' ? "/dash/admin" : "/dash/user");
            }
        } catch (err) {
            console.log(err);
            setLoginError(true);
        }
    };

    const handleGuestLogin = () => {
        setEmail('one@gmail.com');
        setPassword('12345678');
        setRole('user');
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-semibold text-white text-center mb-4">Login</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Email</label>
                            <input type="email" required placeholder="Enter Email" autoComplete="off" className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Password</label>
                            <input type="password" required placeholder="Enter Password" className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                            <label className="inline-flex items-center text-gray-300">
                                <input type="radio" name="role" value="admin" className="form-radio text-blue-600" checked={role === "admin"} onChange={(e) => setRole(e.target.value)} />
                                <span className="ml-2">Admin</span>
                            </label>
                            <label className="inline-flex items-center text-gray-300">
                                <input type="radio" name="role" value="user" className="form-radio text-blue-600" checked={role === "user"} onChange={(e) => setRole(e.target.value)} />
                                <span className="ml-2">User</span>
                            </label>
                        </div>
                        <button type="submit" className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition">Login</button>
                    </form>
                    {loginError && <p className="text-red-500 text-center mt-4">Incorrect email or password</p>}
                    <div className="text-center mt-4">
                        <button onClick={handleGuestLogin} className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition">Login as Guest</button>
                    </div>
                    <p className="text-gray-400 text-center mt-4">Don't have an account? <Link to="/register" className="text-white underline">Sign Up</Link></p>
                </div>
            </div>
        </>
    );
};

export default Login;