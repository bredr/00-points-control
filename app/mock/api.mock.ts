import { defineMock } from "vite-plugin-mock-dev-server";

const state = Object.fromEntries(
  Array(8)
    .fill(true)
    .map((state, idx) => [idx, state]),
);

export default defineMock([
  {
    url: "/api/point/:id",
    method: "GET",
    body(request) {
      const id = request.params.id as number;
      return { is_straight: state[id] };
    },
  },
  {
    url: "/api/point",
    method: "PUT",
    body(request) {
      const { id, is_straight } = request.body as {
        id: number;
        is_straight: boolean;
      };
      state[id] = is_straight;
      return { is_straight: state[id] };
    },
  },
]);
