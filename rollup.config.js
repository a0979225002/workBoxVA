// rollup.config.js
import ts from "rollup-plugin-ts";
import {uglify} from "rollup-plugin-uglify";

/**
 * 打包 Template
 */
export default {
    input: ['dist/sw.ts'],
    output: {
        file: 'dist/sw/sw.js',
        exports: "auto",
        format:"cjs",
    },
    plugins: [
        uglify(),
        ts({
                tsconfig: "./tsconfig.json",
                transpiler: "babel"
            },
        ),
    ]
}
