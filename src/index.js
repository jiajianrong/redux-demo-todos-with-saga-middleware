import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'


function logger() {
    return (dispatch) => {
        return (action) => {
            console.log('dispatching', action);
            // dispatch时执行这里
            var result = dispatch(action);
            return result;
        };
    };
}


function minusId(id) {
    return new Promise(function(res, rej){
        setTimeout(function(){
            res(id-1)
        }, 1000)
    })
}


function* gen(id) {
    let { dispatch, newId } = yield minusId(id);
    console.log(newId, typeof dispatch);
    yield dispatch({type: 'TOGGLE_TODO', id: newId});
}



function sagaMiddleware() {
    return (dispatch) => {
        return (action) => {
            //debugger
            if (action.type === 'TOGGLE_TODO_ASYNC') {
                let g = window.g = gen(action.id)
                let p = g.next()
                p.value.then(function(data){
                    let r = g.next({dispatch, newId: data})
                    console.log(r)
                    r = g.next()
                    console.log(r)
                })
                return;
            }
            // dispatch时执行这里
            var result = dispatch(action);
            return result;
        };
    };
}



const store = createStore(rootReducer, {}, applyMiddleware(sagaMiddleware))

window.globalStore = store


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
