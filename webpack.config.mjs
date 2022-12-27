import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    mode: "production",
    target: "node",
    entry: "./src/server.ts",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: {
                    loader: "ts-loader",
                },
                exclude: [/node_modules/],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "main.js",
        path: resolve(__dirname, "dist"),
        clean: true,
    },
};