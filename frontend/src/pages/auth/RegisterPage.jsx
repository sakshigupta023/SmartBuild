import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await registerUser(data);
      toast.success('Successfully registered');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-xl dark:bg-gray-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex justify-center items-center">
            <span className="text-indigo-600 mr-2">⚡</span> SmartBuild
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create a new account
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}
            />
            <FormInput
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={errors.lastName?.message}
            />
          </div>

          <FormInput
            label="Email Address"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
            })}
            error={errors.email?.message}
          />
          
          <FormInput
            label="Phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <FormInput
            label="Password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' }
            })}
            error={errors.password?.message}
          />

          <div className="pt-2">
            <Button type="submit" fullWidth loading={isLoading}>
              Register
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
