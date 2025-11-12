import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthProvider';
import { FaUserPlus, FaGoogle } from 'react-icons/fa';

const Register = () => {
    const { createUser, updateAuthProfile, signInWithGoogle } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState('');

    const onSubmit = (data) => {
        setRegisterError('');
        const password = data.password;
        if (password.length < 6) {
            setRegisterError('Password must be at least 6 characters.');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setRegisterError('Password must contain at least one uppercase letter.');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setRegisterError('Password must contain at least one lowercase letter.');
            return;
        }

        createUser(data.email, data.password)
            .then(() => {
                updateAuthProfile(data.name, data.photoURL)
                    .then(() => {
                        toast.success('Registration successful! You are logged in.');
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error('Registration successful, but profile update failed.');
                        navigate('/');
                    });
            })
            .catch((error) => {
                console.error(error);
                if (error.code === 'auth/email-already-in-use') {
                    setRegisterError('This email address is already in use.');
                } else {
                    setRegisterError(error.message);
                }
                toast.error('Registration failed.');
            });
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(() => {
                toast.success('Signed in with Google successfully!');
                navigate('/');
            })
            .catch((error) => {
                console.error(error);
                setRegisterError('Google sign-in failed.');
                toast.error('Google sign-in failed.');
            });
    };

    return (
        <div className="hero min-h-screen pt-10">
            <div className="card w-full max-w-lg shadow-2xl bg-base-100 p-8">
                <h1 className="main-heading text-center mb-6">Join Book Haven</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="card-body p-0">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Name</span></label>
                        <input 
                            type="text" 
                            placeholder="Your Name" 
                            className="input input-bordered" 
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Photo URL (Optional)</span></label>
                        <input 
                            type="text" 
                            placeholder="https://example.com/photo.jpg" 
                            className="input input-bordered" 
                            {...register('photoURL')}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input 
                            type="email" 
                            placeholder="email" 
                            className="input input-bordered" 
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input 
                            type="password" 
                            placeholder="password" 
                            className="input input-bordered" 
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {registerError && <p className="text-error text-center mt-4">{registerError}</p>}

                    <div className="form-control mt-6">
                        <button className="btn-primary-custom" type="submit">
                            <FaUserPlus /> Register
                        </button>
                    </div>
                </form>

                <div className="divider my-4">OR</div>
                <div className="form-control">
                    <button onClick={handleGoogleSignIn} className="btn btn-outline btn-info">
                        <FaGoogle /> Sign Up with Google
                    </button>
                </div>

                <p className="text-center mt-6">
                    Already have an account? <Link to="/login" className="link link-primary font-bold">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
