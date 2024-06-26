/* eslint-disable react-hooks/exhaustive-deps */
"use-client";

import { CircleUserRound, MenuIcon } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "../Drawer";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { useRecoilState } from "recoil";
import userState from "@/recoils/userState";
import { adminProfile } from "@/api/auth-api";
import useAuthChecker from "@/lib/useAuthChecker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Dropdown";
import { useRouter } from "next/navigation";

const Navbar = () => {
  useAuthChecker();
  const [user, setUser] = useRecoilState(userState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  const adminTokenString =
    typeof window !== "undefined" ? sessionStorage.getItem("admin-token") : null;
  const adminToken = adminTokenString ? JSON.parse(adminTokenString) : null;

  const fetchUser = useCallback(async () => {
    try {
      const response = await adminProfile(adminToken!.token, { token: adminToken!.token });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to get admin profile:", error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const router = useRouter();

  const handleLogOut = () => {
    sessionStorage.removeItem("admin-token");
    router.push("/login");
  };

  const handleLinkClick = () => {
    drawerCloseRef.current?.click();
  };

  const handleDropdownItemClick = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="w-[100vw] h-10 bg-luoDarkBiege bg-opacity-90 flex justify-between items-center px-2 sm:px-12">
      <Drawer direction="left">
        <DrawerTrigger>
          <MenuIcon color="#F0E8DD" />
        </DrawerTrigger>
        <DrawerContent className="bg-luoDarkBiege flex flex-col gap-10 items-center pt-12">
          <p className="text-luoBiege font-bold text-xl">Menu Navigation</p>
          <div className="flex flex-col gap-5 items-center bg-luoBiege w-full rounded-sm rounded-br-none py-16 h-full">
            <Link
              href={"/dashboard"}
              className="w-11/12 px-5 py-1 text-center rounded-xl hover:bg-brown-light transition duration-500"
              onClick={handleLinkClick}
            >
              <p className="font-semibold text-luoDarkBiege">Manage Cakes</p>
            </Link>
            <Link
              href={"/product-type"}
              className="w-11/12 py-1 text-center rounded-xl hover:bg-brown-light transition duration-500"
              onClick={handleLinkClick}
            >
              <p className="font-semibold text-luoDarkBiege">Manage Product Type</p>
            </Link>
            <Link
              href={"/add-ons"}
              className="w-11/12 py-1 text-center rounded-xl hover:bg-brown-light transition duration-500"
              onClick={handleLinkClick}
            >
              <p className="font-semibold text-luoDarkBiege">Manage Add-ons</p>
            </Link>
          </div>
        </DrawerContent>
        <DrawerClose ref={drawerCloseRef} className="hidden" />
      </Drawer>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-transparent hover:bg-brown-light hover:text-luoDarkBiege flex gap-1"
            size="sm"
          >
            <CircleUserRound />
            {user.username}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="text-center px-2 py-1 hover:bg-brown-light transition duration-500">
            <Link href={"/account"} onClick={handleDropdownItemClick}>
              <p className="font-semibold text-luoDarkBiege">Account Setting</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogOut}
            className="text-center px-2 py-1 hover:bg-brown-light transition duration-500"
          >
            <p className="font-semibold text-luoDarkBiege">Log out</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
