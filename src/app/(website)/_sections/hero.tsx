import Image from "next/image";
import { searchFields } from "../_data/site-data";

function FieldIcon({ type }: { type: (typeof searchFields)[number]["icon"] }) {
  if (type === "calendar")
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="3.5" y="5.5" width="17" height="15" rx="1.5" />
        <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" />
      </svg>
    );
  if (type === "guest")
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 20c.5-3.4 2.6-5.2 6.5-5.2s6 1.8 6.5 5.2" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 text-slate-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M20 10.5c0 5.2-8 10-8 10s-8-4.8-8-10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  );
}

interface HeroProps {
  title1: string;
  title2: string;
  img: string;
  description: string;
}

export function Hero({title1, title2, img, description, } : HeroProps) {
  return (
    <section
      className="hero-motion relative isolate min-h-[620px] overflow-hidden bg-slate-200 sm:min-h-[650px]"
      aria-labelledby="hero-title"
    >
      <Image
        src="/images/HomeHero.png"
        alt="A secluded Scandinavian holiday cabin beside a forest lake"
        fill
        priority
        sizes="100vw"
        className="hero-motion__image object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,35,27,0.22),rgba(17,35,27,0.03)_55%,rgba(17,35,27,0.1))]" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.18)_35%,#f8fafc_100%)]" />
      <div className="relative mx-auto flex min-h-[620px] max-w-6xl flex-col items-center px-5 pb-24 pt-20 text-center sm:min-h-[650px] sm:pt-24">
        <div className="hero-motion__content text-[#EEF2F6] [text-shadow:0_2px_12px_rgba(0,0,0,0.24)]">
          <h1
            id="hero-title"
            className="text-4xl font-bold leading-[1.03] tracking-tight sm:text-5xl"
          >
            {title1}
            <br />
           {title2}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[10px] leading-4 text-white/95">
           {description}
          </p>
        </div>
        <form
          className="hero-motion__search mt-8 grid w-full max-w-4xl gap-2 rounded-sm bg-white/90 p-2 shadow-[0_18px_42px_rgba(17,24,39,0.26)] backdrop-blur-sm md:grid-cols-[repeat(5,minmax(0,1fr))_98px]"
          action="#"
        >
          {searchFields.map((field) => (
            <label
              key={field.label}
              className="flex min-h-12 items-center gap-2 border border-slate-100 bg-white px-2.5 text-left"
            >
              <FieldIcon type={field.icon} />
              <span className="min-w-0">
                <span className="block text-[7px] font-semibold tracking-wide text-slate-400">
                  {field.label}
                </span>
                <span className="flex items-center gap-1 truncate text-[10px] font-semibold text-slate-700">
                  {field.value}
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className="size-3 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="m3 4.5 3 3 3-3" />
                  </svg>
                </span>
              </span>
            </label>
          ))}
          <button
            type="submit"
            className="min-h-12 bg-[#30277a] px-5 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-[#21195b]"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
