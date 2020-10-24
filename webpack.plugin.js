/***********************************
 * Esse código estrutural é um exemplo do que uma aplicação Micro-frontend
 * baseada em Single SPA e React, NÂO repita isso no seu projeto.
 * Construa uma composição melhor ou utilize o single spa CLI.
 *
 ***********************************/

const path = require("path");
const { BannerPlugin, HotModuleReplacementPlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const DotEnvPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const autoprefixer = require("autoprefixer");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");

let isDevServer = false;

if (process.argv.some((arg) => arg.includes("webpack-dev-server"))) {
  isDevServer = true;
}

const getFile = (file, environment) =>
  `${file}${environment ? "." + environment : ""}`;

const webpackConfig = (appName, overridesConfig = () => {}) => {
  return (env = {}) => {
    const isProduction = env.environment === "production";
    const dotEnvFile = getFile(".env", env.environment);
    const dotRedirectsConfig = getFile("_redirects", env.environment);

    const result = {
      mode:
        env.environment !== "production" || isDevServer
          ? "development"
          : "production",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        modules: [process.cwd(), "node_modules"],
      },
      output: {
        publicPath: `/${appName}/`,
        filename: "[name].js",
        libraryTarget: "amd",
        path: path.resolve(process.cwd(), "build"),
      },
      externals: {
        React: "react",
        ReactDOM: "react-dom",
        "single-spa": "single-spa",
      },
      devServer: {
        open: true,
        disableHostCheck: true,
        port: 3000,
        contentBase: "./build",
        headers: { "Access-Control-Allow-Origin": "*" },
        historyApiFallback: {
          index: `/${appName}/index.html`,
        },
      },
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          {
            test: /\.js?$/,
            exclude: [path.resolve(process.cwd(), "node_modules")],
            loader: require.resolve("babel-loader"),
          },
          {
            parser: {
              system: false,
            },
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          {
            test: /\.css$/,
            exclude: [
              path.resolve(process.cwd(), "node_modules"),
              /\.krem.css$/,
            ],
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  localIdentName: "[path][name]__[local]",
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  plugins() {
                    return [autoprefixer];
                  },
                },
              },
            ],
          },
          {
            test: /\.css$/,
            include: [path.resolve(process.cwd(), "node_modules")],
            exclude: [/\.krem.css$/],
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.krem.css$/,
            exclude: [path.resolve(process.cwd(), "node_modules")],
            use: [
              {
                loader: "kremling-loader",
                options: {
                  namespace: appName,
                  postcss: {
                    plugins: {
                      autoprefixer: {},
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      optimization: {
        namedModules: isDevServer,
        // splitChunks: {
        //   chunks: 'all',
        // },
      },
      plugins: [
        new CleanWebpackPlugin(),
        new DotEnvPlugin({
          path: dotEnvFile,
        }),
        new BannerPlugin({
          banner: '"format amd";',
          raw: true,
        }),
        new BundleAnalyzerPlugin({
          analyzerMode: env.analyze || "disabled",
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(process.cwd(), "./public/index.html"),
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env),
        new UnusedFilesWebpackPlugin({
          globOptions: {
            cwd: path.resolve(process.cwd(), "src"),
            ignore: [
              "**/*.mock.*",
              "**/*.mock.*",
              "**/*.test.*",
              "**/*.spec.*",
              "**/*.*.snap",
              "**/test-setup.*",
              isProduction && "**/*preview.*",
            ].filter(Boolean),
          },
        }),
      ],
    };

    !isDevServer &&
      result.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(process.cwd(), dotRedirectsConfig),
              to: path.resolve(
                process.cwd(),
                `./build/${getFile("_redirects")}`
              ),
              toType: "file",
            },
          ],
        })
      );
    !isProduction &&
      result.plugins.push(
        new CopyWebpackPlugin({
          patterns: [{ from: path.resolve(process.cwd(), "./public") }],
        })
      );
    isDevServer && result.plugins.push(new HotModuleReplacementPlugin());
    return overridesConfig(result);
  };
};

module.exports = {
  webpackConfig,
};
