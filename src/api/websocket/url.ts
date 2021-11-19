const testHost = import.meta.env.VITE_TEST_HOST;

const localhost = testHost || window.location.host;

export const baseUrl = `ws://${localhost}/ws/`;

export const url = {
  index: 'index'
};
