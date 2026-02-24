import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <div className="card">
        <h1>Hostel Management System</h1>
        <p>Authentication demo with role-based dashboards.</p>
        <p>
          <Link className="link" href="/login">
            Go to Login
          </Link>
        </p>
        <p>
          <Link className="link" href="/register">
            Go to Register
          </Link>
        </p>
      </div>
    </main>
  );
}
