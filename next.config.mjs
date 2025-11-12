// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  webpack(config, { isServer }) {
    if (isServer) {
      // 既存の externals 配列を展開して、Function で @napi-rs/canvas 以下を commonjs 扱いに
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        ({ request }, callback) => {
          // request が '@napi-rs/canvas' またはサブパスなら external にする
          if (request.match(/^@napi-rs\/canvas($|\/)/)) {
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
      ];
    }
    return config;
  },
}

export default nextConfig
