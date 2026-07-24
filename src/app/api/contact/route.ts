import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
        subject: "New Contact Form Submission",
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
