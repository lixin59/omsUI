import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga';
// import {rootSaga} from './saga' //其实是一个generator
import { defSaga } from '../sagas/index';
import { createLogger } from 'redux-logger';

const middlewares: any[] = [];
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

if (import.meta.env.DEV) {
  const logger = createLogger({
    level: 'info',
    collapsed: true,
    duration: true,
    diff: true
  });
  middlewares.push(logger);
}

const store = applyMiddleware(...middlewares)(createStore)(reducer);
// 负责执行saga
sagaMiddleware.run(defSaga);
export default store;
