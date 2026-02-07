export default function Header() {
    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Atlas Civic AI</h1>
            <div className="flex items-center space-x-4">
                {/* Placeholder for Auth/Profile */}
                <span className="text-sm text-gray-500">Welcome</span>
            </div>
        </header>
    );
}
