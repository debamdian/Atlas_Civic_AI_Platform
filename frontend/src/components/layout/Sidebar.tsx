import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <nav className="space-y-2">
                <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Dashboard
                </Link>
                <Link href="/complaints" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Complaints
                </Link>
                {/* Add more links based on role later */}
            </nav>
        </aside>
    );
}
