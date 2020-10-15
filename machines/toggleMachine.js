import {createMachine, interpret} from 'xstate'
// stateless machine definition => 
const toggleMachine = createMachine({
    id: 'toggle',
    initial: 'inactive',
    states: {
        inactive: {
            on: {
                TOGGLE: 'active'
            }
        },
        active: {
            on: {
                TOGGLE: 'inactive'
            }
        }
    }
})
//
// creating a machine instance with internal state=>
export const toggleService = interpret(toggleMachine)
.onTransition(state => console.log(state.value))

// start() : starts the interpreter from given/initial state