"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Banknote,
  Users,
  ClipboardCheck,
  FileText,
  Settings,
  Contact,
  Book,
  BookOpen,
  Calendar,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const userAvatar = PlaceHolderImages.find(
  (image) => image.id === "admin-avatar"
);

export default function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students", label: "Students", icon: Contact },
    
    { href: "/classes", label: "Classes", icon: Book },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/academic-years", label: "Academic Years", icon: Calendar },

    { href: "/financials", label: "Financials", icon: Banknote },
    { href: "/attendance", label: "Attendance", icon: Users },
    { href: "/exams", label: "Exams", icon: ClipboardCheck },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <Logo />
              <h1 className="text-xl font-bold font-headline text-foreground">
                SchoolWise
              </h1>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="text-sidebar-foreground"
              >
                <Link href={item.href}>
                  <item.icon className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {userAvatar && (
              <Image
                src={userAvatar.imageUrl}
                alt={userAvatar.description}
                width={40}
                height={40}
                data-ai-hint={userAvatar.imageHint}
                className="rounded-full"
              />
            )}
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@school.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
