const path = require('path');
const paths = {
    node_modules: path.resolve(__dirname, './node_modules'),
    root: path.resolve(__dirname, '../../../storefront-child'),
    assets: path.resolve(__dirname, '../../assets'),
    src: path.resolve(__dirname, '../src'),
    img: path.resolve(__dirname, '../src/img'),
    fonts: path.resolve(__dirname, '../src/fonts'),
    js: path.resolve(__dirname, '../src/js'),
    scss: path.resolve(__dirname, '../src/scss'),
    dist: path.resolve(__dirname, '../dist')
}
const AssetsPlugin = require('assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isStat = process.env.arg === 'stat';

const webpackConfig = {
    mode: 'development',
    entry: {
        'common': [ paths.js + '/index.js', paths.scss + '/index.scss'],
        'template-homepage': [ paths.js + '/main.js', paths.scss + '/main.scss'],
    },
    output: {
        filename: isDev ? '[name].js' : '[contenthash].js',
        path: paths.dist,
        assetModuleFilename: isDev ? '[name][ext][query]' : '[contenthash][ext][query]',
    },
    resolve: {
        alias: {
            '@': paths.root,
            '@node_modules': paths.node_modules,
            '@assets': paths.assets,
            '@src': paths.src,
            '@js': paths.js,
            '@scss': paths.scss,
            '@img': paths.img,
            '@fonts': paths.fonts,
            '@dist': paths.dist,
        }
    },
    plugins: [
        new AssetsPlugin({
            filename: 'assets.json',
            includeAllFileTypes: false,
            useCompilerPath: true,
            fullPath: false
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : '[contenthash].css'
        }),
    ],
    optimization: {
        splitChunks: {
            name(module, chunks) {
                return chunks.map((item) => item.name).join('~');
            },
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module, chunks, cacheGroupKey) {
                        const allChunksNames = chunks.map((item) => item.name).join('~');
                        return `${cacheGroupKey}~${allChunksNames}`;
                    },
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: "postcss-loader",
                            options: {
                              postcssOptions: {
                                plugins: [
                                  [
                                    "postcss-preset-env",
                                  ],
                                ],
                              },
                            },
                        },
                        'sass-loader'
                    ]
            },
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline'
            }
        ]
    }
}

if(isDev){
    webpackConfig.devtool = 'source-map';
    webpackConfig.devServer = {

        static: paths.dist,
        port: 3000,
        open: true,
        hot: true,
        proxy: {
        '/': "http://test.loc",
        "secure": false,
        "changeOrigin": true
        }

      };
}

if(isProd){
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
    const TerserWebpackPlugin = require('terser-webpack-plugin');
    webpackConfig.optimization.minimizer = [
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin()
    ]
}

if(isStat){
    const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
