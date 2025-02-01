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
        <div className="w-fit px-1.5 flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ">
          <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <AudioWaveform className="size-3" />
          </div>
          <span className="truncate font-semibold">Streamify</span>
        </div>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
