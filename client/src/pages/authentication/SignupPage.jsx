import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../features/authentication/services/authServices';
import Button from '../../components/ui/Button';
import FormInputField from '../../components/form/FormInputField';
import FormSelectField from '../../components/form/FormSelectField';

const SignupPage = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        confirmPassword: '', 
        role: 'student' 
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            // This now correctly calls the register function defined in authServices.js
            await authService.register({
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            
            // Redirect to login after successful registration
            navigate('/login');
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { label: 'Student', value: 'student' },
        { label: 'Tutor', value: 'tutor' }
    ];

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                
                {error && (
                    <div className="mb-4 p-3 text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSignup} className="space-y-4">
                    <FormInputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FormSelectField
                        label="Register as"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={roleOptions}
                        required
                    />
                    <FormInputField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <FormInputField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Processing...' : 'Register'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;