"use client";
import { useEffect, useRef } from "react";
import { SquarePen } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarHeader,
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
import {
  IconDots,
  IconShare3,
  IconTrash,
  IconChartBar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/contexts/ChatContext";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "@/app/utils/constants";
import { FaSpinner } from "react-icons/fa";
import { useTheme } from "next-themes";
import { ChatOverview } from "@/types/chatOverview";
import Link from "next/link";

export const AppSidebar = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const { isMobile } = useSidebar();
  const { chats, setChats, handleBackClick, shareChat, deleteChat } =
    useChatContext();
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}chats?page=${pageParam}`,
        {
          headers: { Authorization: `Bearer ${session?.jwt}` },
        }
      );
      if (!res.ok) {
        toast.error("Failed to fetch chats", toastConfig);
        console.error("Failed to fetch chats:", res.statusText);
        return [];
      }
      return (await res.json()) as ChatOverview[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // if you get back an empty array, there is no next page
      if (lastPage.length === 0) {
        return undefined;
      }

      return allPages.length;
    },
    enabled: session ? true : false, // only run if session exists
  });

  useEffect(() => {
    if (!session) {
      // if the user is not logged in, empty the chats
      // this prevents the user from seeing cached chats
      setChats([]);
    } else if (status === "success" && data) {
      // update chats after successfully fetching in infinite query
      setChats(data.pages.flat());
    }
  }, [data, status, session, setChats]);

  // used to detect when the user scrolls to the bottom of the sidebar
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [loaderRef.current, hasNextPage, fetchNextPage]);

  return (
    <>
      {session && (
        <Sidebar>
          {/* remove the padding to ensure that the height is equal to --header-height */}
          <SidebarHeader className="p-0">
            <SidebarMenu>
              <SidebarMenuItem className="list-none">
                <div className="h-(--header-height)" aria-hidden="true" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {/* workaround: these css stylings are used to remove the styles applied in globals.css */}
                <SidebarMenu className="pl-0!">
                  <SidebarMenuItem className="list-none">
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        aria-label="New chat"
                        size="icon"
                        onClick={handleBackClick}
                      >
                        <SquarePen className="!size-5" />
                        <span className="ml-2">New chat</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="list-none">
                    <SidebarMenuButton asChild>
                      <a
                        href="https://charts.mongodb.com/charts-step-iiyjphy/public/dashboards/f6b40c75-f77d-4a6d-83b1-a97b3683aebc"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          aria-label="Analytics"
                          size="icon"
                        >
                          <IconChartBar className="!size-5" />
                          <span className="ml-2">Analytics</span>
                        </Button>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              {status === "pending" ? (
                <div className="flex justify-center items-center my-4">
                  <FaSpinner className="animate-spin text-4xl" />
                </div>
              ) : status === "error" ? (
                <div className="p-4 text-red-600">
                  Failed to load chats:{" "}
                  {error instanceof Error && error.message}
                </div>
              ) : (
                <SidebarGroupContent>
                  {/* workaround: these css stylings are used to remove the styles applied in globals.css */}
                  <SidebarMenu className="pl-0!">
                    {chats.map((item) => (
                      <SidebarMenuItem key={item.chat_id}>
                        <SidebarMenuButton asChild>
                          <Link href={`/chat/${item.chat_id}`}>
                            <span>{item.query}</span>
                          </Link>
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
                                <p className="line-clamp-3 font-bold text-secondary-foreground">
                                  {item.query}
                                </p>
                                <br />
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

                  {isFetchingNextPage && (
                    <div className="flex justify-center my-4">
                      <FaSpinner className="animate-spin text-4xl" />
                    </div>
                  )}
                  <div ref={loaderRef} />
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
      <ToastContainer theme={theme} />
    </>
  );
};
