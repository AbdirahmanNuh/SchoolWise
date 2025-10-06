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
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

const userAvatar = PlaceHolderImages.find(
  (image) => image.id === "admin-avatar"
);

export default function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const navItems = [
    { href: "/", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/students", label: t("students"), icon: Contact },
    { href: "/classes", label: t("classes"), icon: Book },
    { href: "/financials", label: t("financials"), icon: Banknote },
    { href: "/attendance", label: t("attendance"), icon: Users },
    { href: "/exams", label: t("exams"), icon: ClipboardCheck },
    { href: "/reports", label: t("reports"), icon: FileText },
    { href: "/settings", label: t("settings"), icon: Settings },
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
            <LanguageSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
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
            <p className="text-sm font-semibold text-foreground">{t("adminUser")}</p>
            <p className="text-xs text-muted-foreground">admin@school.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
