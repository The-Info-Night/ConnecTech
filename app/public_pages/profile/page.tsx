"use client";

import SideNavbar from "../../components/SideNavbar";
import ProfileEditor from "./ProfileEditor";

export default function ProfilePage() {
  return (
    <div
      className="font-sans min-h-screen w-full relative"
      style={{
        background:
          "linear-gradient(180deg, #F18585 0%, #F49C9C 18%, #F6AEAE 34%, #F8CACF 50%, #EED5FB 56%, #E4BEF8 72%, #D5A8F2 85%, #CB90F1 94%, #C174F2 100%)",
      }}
    >
      <SideNavbar />
      <ProfileEditor />
    </div>
  );
}


