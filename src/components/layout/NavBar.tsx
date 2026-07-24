import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/jobs", label: "Jobs" },
  { href: "/employers", label: "Employers" },
  { href: "/contact", label: "Contact Us" },
];

export function NavBar() {
  return (
    <header className="border-b border-neutral-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          IVP Africa
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/register" className="rounded bg-neutral-900 px-3 py-1.5 text-white">
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
