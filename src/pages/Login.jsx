import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthProvider';
import { FaGoogle, FaSignInAlt } from 'react-icons/fa';


const Login = () => {
    const { signIn, signInWithGoogle } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [loginError, setLoginError] = useState('');


    const onSubmit = (data) => {
        setLoginError('');
        signIn(data.email, data.password)
            .then(() => {
                toast.success('Logged in successfully!');
                navigate(from, { replace: true });
            })
            .catch(() => {
                setLoginError('Login failed. Check your email and password.');
                toast.error('Login failed.');
            });
    };


    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(() => {
                toast.success('Signed in with Google successfully!');
                navigate(from, { replace: true });
            })
            .catch(() => {
                setLoginError('Google sign-in failed.');
                toast.error('Google sign-in failed.');
            });
    };


    return (
        <div className="hero min-h-screen pt-10 bg-gray-50 dark:bg-gray-900 transition duration-500">
            <div className="card w-full max-w-lg shadow-2xl bg-base-100 dark:bg-gray-800 p-8">
                <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">Login to Book Haven</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="card-body p-0">
                    <div className="form-control">
                        <label className="label"><span className="label-text text-gray-700 dark:text-gray-200">Email</span></label>
                        <input
                            type="email"
                            placeholder="email"
                            className="input input-bordered dark:bg-gray-700 dark:text-white"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text text-gray-700 dark:text-gray-200">Password</span></label>
                        <input
                            type="password"
                            placeholder="password"
                            className="input input-bordered dark:bg-gray-700 dark:text-white"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    {loginError && <p className="text-error text-center mt-4">{loginError}</p>}
                    <div className="form-control mt-6">
                        <button className="btn-primary-custom flex items-center justify-center gap-2" type="submit">
                            <FaSignInAlt /> Login
                        </button>
                    </div>
                </form>
                <div className="divider my-4">OR</div>
                <div className="form-control">
                    <button onClick={handleGoogleSignIn} className="btn btn-outline btn-info flex items-center justify-center gap-2">
                        <FaGoogle /> Sign In with Google
                    </button>
                </div>
                <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
                    Don't have an account? <Link to="/register" className="link link-primary font-bold">Register here</Link>
                </p>
            </div>
        </div>
    );
};


export default Login;











