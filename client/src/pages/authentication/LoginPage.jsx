import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInputField from '../../components/form/FormInputField';
import Button from '../../components/ui/Button';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        email: '', 
        password: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(formData);
            console.log("Login successful, navigating to dashboard...");
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error("Login failed:", err);
            setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Login to Tutors Portal
                </h2>
                
                {error && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FormInputField 
                        label="Email Address" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange}
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

                    <Button 
                        type="submit" 
                        className="w-full mt-2" 
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;