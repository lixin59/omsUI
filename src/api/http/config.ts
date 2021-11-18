const testHost = 'http://10.1.1.74:9090';

const localhost = testHost || window.location.origin;

export const baseUrl = `${localhost}/api/v1`;
