import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"



export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Your logic to authenticate the user
        return {
          id: "user-id",
          name: "John Doe",
          email: credentials.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
