import Link from "next/link";

export default function NewsTicker({ items }: { items: { text: string; href: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="container">
      <div className="ticker">
        <span className="ticker-label z-10">Sekilas Info</span>
        <div className="ticker-track">
          {[...items, ...items].map((item, i) => (
            <Link key={i} href={item.href} className="ticker-item">
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
