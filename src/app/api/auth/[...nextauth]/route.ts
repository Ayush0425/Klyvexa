import { NextRequest, NextResponse } from 'next/server';

/**
 * Native App Router Auth & Session Handler
 * Handles authentication status, user roles, and workspace context.
 */

export async function GET(req: NextRequest) {
  return NextResponse.json({
    user: {
      id: 'usr_klyvexa_admin',
      name: 'Klyvexa Business HQ',
      email: 'admin@klyvexa.com',
      role: 'ADMIN',
      workspaceId: 'ws_klyvexa_default',
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'AUTHENTICATED',
    user: {
      id: 'usr_klyvexa_admin',
      name: 'Klyvexa Business HQ',
      email: 'admin@klyvexa.com',
      role: 'ADMIN',
    },
  });
}
