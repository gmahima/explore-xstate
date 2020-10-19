import {interpret, Machine} from 'xstate'

export const promiseMachine = Machine({
    id: 'promise',
    initial: 'pending',
    states: {
        pending: {
            on: {
                RESOLVE: 'resolved',
                REJECT: 'rejected',
                // "*": "somewhere" // wildcard transition: activated by any event except '' if no other event of higher specificity takes place
            }
        },
        resolved: {
            type: 'final'
        },
        rejected: {
            type: 'final'
        }
    }
})

// to interpret the machine and make it run, we need to add an interpreter. This creates a service



export const makeUseOfPromiseMachine = (transition) => {
    const promiseService = interpret(promiseMachine).onTransition(state => console.log(state.value))
    promiseService.start()
    promiseService.send(transition)

}
