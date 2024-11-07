import Link from 'next/link';

const Sidebar = () => {

  return (
    <aside className="bg-gray-800 text-white w-64 p-4">
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/admin" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/drivers" className="hover:underline">
              Drivers
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/teams" className="hover:underline">
              Teams
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
