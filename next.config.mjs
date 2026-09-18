/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",  // <=== enables static exports

  // The project board is the landing page now, so keep the old URL working
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
