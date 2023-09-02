import createSagaMiddleware from "redux-saga"
import { configureStore } from "@reduxjs/toolkit"
import rootSaga from "../sagas"

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
	reducer: () => {},
	middleware: [
		sagaMiddleware
	]
})

sagaMiddleware.run(rootSaga)

export default store