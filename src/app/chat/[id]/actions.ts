"use server";

import { revalidatePath } from "next/cache";

export const revalidatePathForChat = async (chatId: string) => {
  revalidatePath(`/chat/${chatId}`);
};
