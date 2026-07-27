import { default as nextAuthMiddleware } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest, event: any) {
  return (nextAuthMiddleware as any)(req, event);
}

export const config = {
  matcher: ["/admin/:path*"],
};
