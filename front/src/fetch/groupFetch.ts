import { CHAT_GROUP, CHAT_GROUP_USERS } from "@/lib/apiAuthRoutes";

export async function fetchChatGroups(token: string) {
  const res = await fetch(CHAT_GROUP, {
    headers: {
      Authorization: token,
    },
    next: {
      revalidate: 60 * 60,
      tags: ["dashboard"],
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return [];
}

export async function fetchAllPublicGroups() {
  try {
    const res = await fetch(`${CHAT_GROUP}/public`, {
      next: {
        revalidate: 60 * 60,
        tags: ["communities"],
      },
    });

    if (!res.ok) {
      return [];
    }

    const response = await res.json();
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching public groups:", error);
    return [];
  }
}

export async function fetchChatGroup(id: string, token: string) {
  const res = await fetch(`${CHAT_GROUP}/${id}`, {
    headers: {
      Authorization: token,
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return null;
}

export async function fetchChatGroupUsers(id: string, token: string) {
  const res = await fetch(`${CHAT_GROUP_USERS}?group_id=${id}`, {
    cache: "no-cache",
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return [];
}
