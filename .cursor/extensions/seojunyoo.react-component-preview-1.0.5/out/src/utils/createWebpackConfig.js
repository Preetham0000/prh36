"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Webpack = require("webpack");
const createWebpackConfig = (extensionPath, workspacePath) => {
    const babelLoader = require.resolve("babel-loader");
    const babelPresetList = ["@babel/preset-env", "@babel/preset-react"].map((preset) => require.resolve(preset));
    const cssLoaderList = ["style-loader", "css-loader"].map((loader) => require.resolve(loader));
    return {
        mode: "development",
        context: path.resolve(extensionPath, "preview"),
        entry: path.resolve(extensionPath, "preview", "index.js"),
        output: {
            filename: "bundle.js",
            path: path.resolve(extensionPath, "preview"),
        },
        plugins: [
            new Webpack.ProvidePlugin({
                React: "react",
            }),
        ],
        devtool: false,
        resolve: {
            modules: [
                path.resolve(extensionPath, "node_modules"),
                path.resolve(workspacePath, "node_modules"),
            ],
            extensions: [".js", ".jsx"],
        },
        module: {
            rules: [
                {
                    test: /\.(html)$/,
                    use: ["htmlLoader"],
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: babelLoader,
                        options: {
                            presets: babelPresetList,
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: cssLoaderList,
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: require.resolve("file-loader"),
                        },
                    ],
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use: [
                        {
                            loader: require.resolve("file-loader"),
                        },
                    ],
                },
            ],
        },
        cache: true,
        stats: "errors-only",
        devServer: {
            static: {
                directory: path.resolve(extensionPath, "preview"),
                watch: true,
            },
            port: 9132,
            host: "localhost",
            client: {
                overlay: false,
                logging: "none",
            },
            hot: true,
        },
    };
};
exports.default = createWebpackConfig;
//# sourceMappingURL=createWebpackConfig.js.map