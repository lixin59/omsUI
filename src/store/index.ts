import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga';
// import {rootSaga} from './saga' //其实是一个generator
import { defSaga } from '../sagas/index';

const sagaMiddleware = createSagaMiddleware();
const store = applyMiddleware(sagaMiddleware)(createStore)(reducer);
// 负责执行saga
sagaMiddleware.run(defSaga);
export default store;
