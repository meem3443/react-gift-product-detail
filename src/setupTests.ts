import { beforeAll, afterEach, afterAll, vi } from "vitest";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server";

afterEach(() => {
  cleanup();
});

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const mockAlert = vi.fn();
Object.defineProperty(window, "alert", { value: mockAlert });
