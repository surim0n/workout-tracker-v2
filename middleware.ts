import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Authentication middleware disabled for development
export function middleware(request: NextRequest) {
  // Simply pass through all requests without authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)  
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
