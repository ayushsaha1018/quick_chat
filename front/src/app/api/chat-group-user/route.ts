import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-group-user`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error in chat-group-user POST:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to join group" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const group_id = searchParams.get("group_id");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-group-user?group_id=${group_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error in chat-group-user GET:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch group users" },
      { status: error.response?.status || 500 }
    );
  }
} 