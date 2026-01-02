import { MainLayout } from '@/layouts';

export default function DemoMainPage() {
  return (
    <MainLayout>
      <div className="container">
        <h1>Main Layout Demo</h1>
        <p className="text-secondary">
          This page demonstrates the MainLayout component.
        </p>
        <p>
          The MainLayout includes a header with navigation, main content area, and footer.
        </p>
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Features of MainLayout:</h3>
          <ul>
            <li>Sticky header with navigation</li>
            <li>Flexible main content area</li>
            <li>Footer at the bottom</li>
            <li>Responsive design</li>
            <li>Custom SCSS styling</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
