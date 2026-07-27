import Link from "next/link";
import { getPublicSettings } from "@/lib/data";
import { DesktopNav, MobileNav } from "@/components/NavLinks";
import SearchBar from "@/components/SearchBar";
import LoginModal from "@/components/LoginModal";
import DarkModeToggle from "@/components/DarkModeToggle";

export default async function SiteHeader() {
  const settings = await getPublicSettings();
  const name = settings?.village_name || "Portal Desa";
  const subtitle = settings?.district || "Website Resmi Pemerintah Desa";

  return (
    <header className="site-header w-full">
      <div className="header-inner mx-auto w-full lg:w-max">
        {/* <div className="header-tools">
          <SearchBar />
          <DarkModeToggle />
          <LoginModal />
        </div> */}
        <details className="nav-details">
          <summary>Menu</summary>
          <MobileNav />
        </details>
        <DesktopNav />
      </div>
    </header>
  );
}
