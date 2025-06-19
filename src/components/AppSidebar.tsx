"use client";
import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconDots, IconShare3, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/contexts/ChatContext";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "@/app/utils/constants";
import { FaSpinner } from "react-icons/fa";
import { useTheme } from "next-themes";

export const AppSidebar = () => {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const { theme } = useTheme();
  const { chats, setChats, handleBackClick, shareChat, deleteChat } =
    useChatContext();
  const menuItems = [
    {
      title: "New chat",
      icon: SquarePen,
      onClick: handleBackClick,
    },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const getChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}chat`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.log({ errorFetchingChats: error });
      toast.error("Failed to fetch chats", toastConfig);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (session) {
      getChats();
    } else {
      // if the user is not logged in, empty the chats
      // this prevents the user from seeing cached chats
      setChats([]);
    }
  }, [session]);

  return (
    <>
      <Sidebar>
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
            {isLoading ? (
              <div className="flex justify-center items-center my-4">
                <FaSpinner className="animate-spin text-4xl" />
              </div>
            ) : (
              <SidebarGroupContent>
                {/* workaround: these css stylings are used to remove the styles applied in globals.css */}
                <SidebarMenu className="pl-0!">
                  {chats.map((item) => (
                    <SidebarMenuItem key={item.chat_id}>
                      <SidebarMenuButton asChild>
                        <a href={`/chat/${item.chat_id}`}>
                          <span>{item.query}</span>
                        </a>
                      </SidebarMenuButton>
                      {/* to use alertdialog with dropdown, see here: https://ui.shadcn.com/docs/components/dialog */}
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction
                              showOnHover
                              className="data-[state=open]:bg-accent rounded-sm"
                            >
                              <IconDots />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-24 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                          >
                            <DropdownMenuItem
                              onClick={() => shareChat(item.chat_id)}
                            >
                              <IconShare3 />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem variant="destructive">
                                <IconTrash />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete:{" "}
                              {
                                <>
                                  <p className="line-clamp-3 font-bold">
                                    {item.query}
                                  </p>
                                  <br />
                                </>
                              }{" "}
                              Note: This chat will remain stored on the server
                              to investigate malicious requests.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 text-white hover:bg-red-600"
                              onClick={() => deleteChat(item.chat_id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <ToastContainer theme={theme} />
    </>
  );
};
