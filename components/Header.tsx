"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";

interface Props {
  session: Session;
}

const Header = ({ session }: Props) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5 ">
      <Link href="/">
        <Image src={"/icons/logo.svg"} alt="logo" width={40} height={40} />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        {/*<li>*/}
        {/*  <Link*/}
        {/*    href="/library"*/}
        {/*    className={cn(*/}
        {/*      "text-base cursor-pointer capitalize",*/}
        {/*      pathname === "/library" ? "text-light-200" : "text-light-100",*/}
        {/*    )}*/}
        {/*  >*/}
        {/*    Library*/}
        {/*  </Link>*/}
        {/*</li>*/}
        <li>
          <Link href="/profile" className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="text-white bg-amber-400">
                {getInitials(session.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
            <p className="text-white">{session.user?.name}</p>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
