import { AuthLayout } from '@/layouts';
import RegisterForm from '@/components/RegisterForm/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
