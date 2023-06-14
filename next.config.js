/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 
  providers: [ 
  ],
  callbacks: {
  },
  secret: process.env.JWT_SECRET,
}
