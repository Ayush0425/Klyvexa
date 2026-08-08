import { authOptions } from '@/lib/auth/auth-options';

// NextAuth route handler for Next.js App Router
// In NextAuth v4 with App Router, handlers are created via standard NextAuth function
// We export standard GET and POST handlers
export async function GET(req: Request) {
  const { default: NextAuth } = await import('next-auth');
  return NextAuth(authOptions)(req as any, {} as any);
}

export async function POST(req: Request) {
  const { default: NextAuth } = await import('next-auth');
  return NextAuth(authOptions)(req as any, {} as any);
}
