const withImages = require('next-images');

const config = {
  async redirects() {
    return [
      {
        source: '/dashboards',
        destination: '/dashboards/tasks',
        permanent: true
      }
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/bankers',
        destination: 'http://3.25.110.0:3001/banker-directory/get-directories'
      }
    ];
  }
};

module.exports = withImages(config);
