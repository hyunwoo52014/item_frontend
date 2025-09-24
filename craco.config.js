// D:\test\item_frontend\craco.config.js
module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Webpack 5에서 Node.js 코어 모듈 폴리필을 추가
            const fallback = webpackConfig.resolve.fallback || {};
            Object.assign(fallback, {
                "http": require.resolve("stream-http"),
                "https": require.resolve("https-browserify"),
                "zlib": require.resolve("browserify-zlib"),
                "stream": require.resolve("stream-browserify"),
                "crypto": require.resolve("crypto-browserify"),
                "buffer": require.resolve("buffer/"),
                "util": require.resolve("util/")
            });
            webpackConfig.resolve.fallback = fallback;
            return webpackConfig;
        },
    },
};