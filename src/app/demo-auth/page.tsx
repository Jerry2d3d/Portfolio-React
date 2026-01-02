import { AuthLayout } from '@/layouts';

export default function DemoAuthPage() {
  return (
    <AuthLayout>
      <h2 className="text-center">Auth Layout Demo</h2>
      <p className="text-secondary text-center" style={{ marginTop: '1rem' }}>
        This page demonstrates the AuthLayout component.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <h4>Features of AuthLayout:</h4>
        <ul>
          <li>Centered card design</li>
          <li>Perfect for login/register forms</li>
          <li>Gradient background</li>
          <li>Clean and minimal</li>
          <li>Fully responsive</li>
        </ul>
        <p className="text-tertiary" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          This layout will be used for authentication pages in Stage 2.
        </p>
      </div>
    </AuthLayout>
  );
}
