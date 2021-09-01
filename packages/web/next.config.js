module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:pathname*',
        destination: 'http://localhost:8787/:pathname*',
      },
    ];
  },
};
