import {createMachine, interpret, assign} from 'xstate'

const fetchMachine = createMachine({
    id: 'Poke-api',
    initial: 'idle',
    context: {
        pokemon: null
    },
    states: {
        idle: {
            on: {
                FETCH: 'loading'
            }
        },
        loading: {
            invoke: {
                id: 'fetch-subreddit',
                src: (context, event) => {
                    fetch('https://www.reddit.com/r/react.json').then(res=> res.json()).then(res => {console.log(res.data); return res.data})
                },
                onDone: {
                    target: 'resolved',
                    actions: assign({
                        pokemon: (context, event) => event.data
                    })
                },
                onError: 'rejected'
            },
            on: {
                CANCEL: 'idle'
            }
        },
        resolved: {
            type: 'final'
        },
        rejected: {
            on: {
                FETCH: 'loading'
            }
        }
    }

})

export const fetchService = interpret(fetchMachine)
.onTransition(state => console.log(state))