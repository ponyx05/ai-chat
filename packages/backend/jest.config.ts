import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", //根据ts的预配置
  roots: ["<rootDir>/src"], //测试的所在目录。<rootDir>是项目根目录
  testMatch: ["**/*.test.ts"], //哪些是测试文件
  testTimeout: 10000, //允许测试的超时时间。当有网络请求时进行配置
  testEnvironment: "node", //测试环境
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/settings/setupTest.ts"], //测试前执行的文件
  moduleFileExtensions: ["ts", "js", "json"], //需要处理的文件扩展
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"], //收集覆盖率的文件
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
