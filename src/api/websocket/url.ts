const testHost = '';

const localhost = testHost || window.location.host;

export const baseUrl = `ws://${localhost}/ws/`;

export const url = {
  index: 'index'
};
