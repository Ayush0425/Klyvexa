import { REQUIRED_META_SCOPES } from '../meta/oauth';

export interface AppUserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    workspaceId?: string;
    role?: 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER';
  };
}

/**
 * NextAuth & Meta OAuth Authentication Options
 */
export const authOptions = {
  providers: [
    {
      id: 'facebook',
      name: 'Facebook & Instagram Business',
      type: 'oauth' as const,
      authorization: {
        url: 'https://www.facebook.com/v20.0/dialog/oauth',
        params: {
          scope: REQUIRED_META_SCOPES.join(','),
          response_type: 'code',
          auth_type: 'rerequest',
        },
      },
      token: 'https://graph.facebook.com/v20.0/oauth/access_token',
      userinfo: 'https://graph.facebook.com/v20.0/me?fields=id,name,email,picture',
      clientId: process.env.META_APP_ID || '',
      clientSecret: process.env.META_APP_SECRET || '',
      profile(profile: { id: string; name: string; email?: string; picture?: { data?: { url?: string } } }) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email || `${profile.id}@instagram-business.local`,
          image: profile.picture?.data?.url,
        };
      },
    },
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token) {
        session.user.id = token.sub;
        session.user.workspaceId = 'ws_default_agency_1';
        session.user.role = 'ADMIN';
      }
      return session;
    },
    async jwt({ token, account, user }: { token: any; account: any; user: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'default_insta_flow_auth_secret_dev_32char!',
};
