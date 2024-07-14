"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./Logout";

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          <li>
            <Link
              href="/admin"
              className={`block py-2 px-4 rounded ${
                isActive("/admin") ? "bg-gray-700" : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`block py-2 px-4 rounded ${
                isActive("/admin/users") ? "bg-gray-700" : ""
              }`}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/admin/pages"
              className={`block py-2 px-4 rounded ${
                isActive("/admin/pages") ? "bg-gray-700" : ""
              }`}
            >
              Page
            </Link>
          </li>
          <li>
            <Link
              href="/admin/posts"
              className={`block py-2 px-4 rounded ${
                isActive("/admin/posts") ? "bg-gray-700" : ""
              }`}
            >
              Posts
            </Link>
          </li>
          <li>
            <Link
              href="/admin/categories"
              className={`block py-2 px-4 rounded ${
                isActive("/admin/categories") ? "bg-gray-700" : ""
              }`}
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href="/admin/tags"
              className={`block py-2 px-4 rounded ${
                isActive("/admin/tags") ? "bg-gray-700" : ""
              }`}
            >
              Tags
            </Link>
          </li>
          <li>
            <Link
              href="/admin/comments"
              className={`block py-2 px-4 rounded ${
                isActive("/admin/comments") ? "bg-gray-700" : ""
              }`}
            >
              Comments
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
