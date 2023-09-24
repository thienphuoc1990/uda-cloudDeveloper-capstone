import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const MockAxios = new MockAdapter(axios);
axios.prototype.create = (_config: any) => {
  return MockAxios;
};

export { MockAxios };