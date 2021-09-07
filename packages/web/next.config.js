module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:pathname*',
        destination: 'http://localhost:8787/api/:pathname*',
      },
      {
        source: '/methods/:pathname*',
        destination: '/api/:pathname*',
      },
    ];
  },
};
