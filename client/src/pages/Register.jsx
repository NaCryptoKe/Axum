import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

function RegisterForm() {
  const { register: registerField, handleSubmit } = useForm();
  const { register } = useAuth();

  const onSubmit = async (data) => {
    try {
      await register(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...registerField("username")} placeholder="Username" />
      <input {...registerField("email")} placeholder="Email" />
      <input type="password" {...registerField("password")} placeholder="Password" />
      <input {...registerField("display_name")} placeholder="Display Name" />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
