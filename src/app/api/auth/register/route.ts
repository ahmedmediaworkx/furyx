import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";
import { registerUser } from "@/server/services/auth-service";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());
    const user = await registerUser(payload);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to register user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
