"use client";

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  SquarePen,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/contexts/ChatContext";

export const AppSidebar = () => {
  const { handleBackClick } = useChatContext();
  const menuItems = [
    {
      title: "New chat",
      icon: SquarePen,
      onClick: handleBackClick,
    },
  ];

  return (
    <Sidebar>
      {/* TODO: update colour scheme */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* workaround: these css stylings are used to remove the styles applied in globals.css */}
            <SidebarMenu className="pl-0!">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="list-none">
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      aria-label={item.title}
                      size="icon"
                      onClick={item.onClick}
                    >
                      <item.icon className="!size-5" />
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
