import Image from "next/image";
import { profile } from "@/data/profile";

/** initials 를 비워두면 이름 첫 글자를 씁니다. */
const initials = profile.initials || profile.name.charAt(0);

export function Profile() {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-200 dark:bg-slate-700 dark:ring-slate-700">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={`${profile.name} 프로필 사진`}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <span
            aria-label={`${profile.name} 프로필`}
            className="select-none text-3xl font-semibold tracking-tight text-slate-600 dark:text-slate-200"
          >
            {initials}
          </span>
        )}
      </div>

      <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-50">
        {profile.name}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {profile.bio}
      </p>
    </header>
  );
}
