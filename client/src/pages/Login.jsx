import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const { register: registerField, handleSubmit } = useForm();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...registerField("identifier")} placeholder="Username or Email" />
      <input type="password" {...registerField("password")} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
