import { NextRequest, NextResponse } from "next/server"
import { validateAdminPassword, getAuthCookieOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    const cookieOpts = getAuthCookieOptions()
    response.cookies.set(cookieOpts)
    return response
  } catch (error) {
    console.error("[Admin Login] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
