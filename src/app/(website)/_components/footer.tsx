import Link from "next/link";
import { footerLinks } from "../_data/site-data";

const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4.5 7 7.5 5.5L19.5 7" /></svg>;
const PhoneIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7.1 3.8 5.2 5.2c-1.1.8-.9 3.7 1.1 6.9 2 3.1 4.6 5.2 5.9 4.8l2.2-1.1-2.1-3.2-1.7.9a10 10 0 0 1-2.5-3.8l1.5-1.2-2.5-4.7Z" /></svg>;
const PinIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 10.5c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10.5" r="2.25" /></svg>;

export function Footer() {
  return (
    <footer className="border-t-4 border-[#30277a] bg-[#41388d] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-8 py-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.55fr] lg:gap-14">
        <div><Link href="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight"><span className="grid size-7 place-items-center rounded-lg border-2 border-white text-sm">⌁</span>LOGOIPSUM<sup className="text-[7px]">®</sup></Link><p className="mt-3 max-w-52 text-[10px] leading-4 text-indigo-100">Luxury Scandinavian-inspired holiday resorts and premium property bookings across Europe. Experience nature without sacrificing comfort.</p><div className="mt-5 flex gap-3">{["f", "◎", "◉"].map((social) => <Link key={social} href="#" className="grid size-5 place-items-center rounded-full bg-white/15 text-[9px] transition-colors hover:bg-white/25" aria-label="Social media">{social}</Link>)}</div></div>
        <FooterColumn heading="Company" items={footerLinks.company} />
        <FooterColumn heading="Explore" items={footerLinks.explore} />
        <div><h2 className="text-[11px] font-semibold">Contact Details</h2><address className="mt-3 space-y-2.5 text-[10px] not-italic leading-4 text-indigo-100"><a href="mailto:info@dreamrental.eu" className="flex gap-2 hover:text-white"><MailIcon />info@dreamrental.eu</a><a href="tel:+420688982005" className="flex gap-2 hover:text-white"><PhoneIcon />+420 688 982 005</a><p className="flex gap-2"><PinIcon />Ke Kablu 683/3, 102 00<br />Prague-Dolní Měcholupy</p></address></div>
      </div>
    </footer>
  );
}

function FooterColumn({ heading, items }: { heading: string; items: readonly string[] }) {
  return <div><h2 className="text-[11px] font-semibold">{heading}</h2><ul className="mt-3 space-y-1.5">{items.map((item) => <li key={item}><Link href="#" className="text-[10px] text-indigo-100 transition-colors hover:text-white">{item}</Link></li>)}</ul></div>;
}
