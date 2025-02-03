import {
  AudioWaveform,
  BarChart2,
  CreditCard,
  Home,
  MessageCircleQuestion,
  Settings,
  UserCircle,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart2,
    },
    {
      title: "Subscriptions",
      url: "#",
      icon: CreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "#",
      icon: UserCircle,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <AudioWaveform className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Streamify</span>
            </div>
          </a>
        </SidebarMenuButton>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
