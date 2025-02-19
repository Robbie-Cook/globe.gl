import resolve from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postCss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import { name, homepage, version, dependencies } from "./package.json";

const shortName = name.replace("@robbie-cook/", '');

const umdConf = {
  format: "umd",
  name: "Globe",
  banner: `// Version ${version} ${shortName} - ${homepage}`,
};

export default [
  {
    input: "src/index.js",
    output: [
      {
        ...umdConf,
        file: `dist/${shortName}.js`,
        sourcemap: true,
      },
      {
        // minify
        ...umdConf,
        file: `dist/${shortName}.min.js`,
        plugins: [
          terser({
            output: { comments: "/Version/" },
          }),
        ],
      },
    ],
    plugins: [
      resolve(),
      commonJs(),
      postCss(),
      babel({ exclude: "node_modules/**", babelHelpers: "bundled" }),
    ],
  },
  {
    // commonJs and ES modules
    input: "src/index.js",
    output: [
      {
        format: "cjs",
        file: `dist/${shortName}.common.js`,
        exports: "auto",
      },
      {
        format: "es",
        file: `dist/${shortName}.module.js`,
      },
    ],
    external: Object.keys(dependencies),
    plugins: [postCss(), babel({ babelHelpers: "bundled" })],
  },
  {
    // expose TS declarations
    input: "src/index.d.ts",
    output: [
      {
        file: `dist/${shortName}.d.ts`,
        format: "es",
      },
    ],
    plugins: [dts()],
  },
];
