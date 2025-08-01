// src/mocks/server.ts
import { setupServer } from "msw/node"; // Node.js 환경을 위한 setupServer 임포트
import { handlers } from "./handlers"; // 정의된 핸들러들 임포트

export const server = setupServer(...handlers);
