import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const authOptions: NextAuthOptions = {
  debug: true,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],

  session: { strategy: 'jwt' },

  // 👇 mobile + cross-domain friendly cookies
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',                // ❗ mobile + webview ke liye zaroori
        secure: process.env.NODE_ENV === 'production',
        path: '/'
        // agar kabhi subdomain share karna ho to:
        // domain: '.f2fintech.in'
      }
    }
  },

  pages: {
    signIn: '/login',
    error: '/login'
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;

      const email = user?.email;
      if (!email) return false;

      try {
        const res = await fetch(
          `${API_BASE}/auth/profile-by-email/${encodeURIComponent(email)}`,
          {
            method: 'GET'
            // headers wagaira agar chahiye to yahan add kar sakte ho
          }
        );

        if (res.ok) return true;

        // user not found in backend
        return false;
      } catch (err) {
        // yahan temporarily true bhi kar sakte ho agar backend down ho to
        // but security wise false better hai
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        if (url === baseUrl || url === `${baseUrl}/`) {
          return `${baseUrl}/directory/tasks`;
        }
        return url;
      }

      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      return `${baseUrl}/directory/tasks`;
    }
  }
};

export default NextAuth(authOptions);
