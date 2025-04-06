import Link from 'next/link';

interface PropType {
  text: string;
  href: string;
}

export default function NavItem({ text, href }: PropType) {
  return (
    <Link href={href} className="font-medium hover:text-gray-400">
      {text}
    </Link>
  );
}
