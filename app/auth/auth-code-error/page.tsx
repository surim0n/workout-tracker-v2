import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>
              Sorry, we couldn't sign you in. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              There was an issue with the authentication process. This might happen if:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• The authentication link has expired</li>
              <li>• There was a network connection issue</li>
              <li>• The authentication was cancelled</li>
            </ul>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}