import {Machine, interpret} from 'xstate'

// 1. self-transition: 
    
//  if internal => wont exit or re-enter state node but may do so for child state nodes
// if external => exit & re-enter state node, may also do so for child state

// BY DEFAULT, ALL TRANSITIONS WITH A SPECIFIC TARGET ARE EXTERNAL

// 1.1 internal transition
//  created by specifying a relative target eg: '.left' or by specifying {internal: true}
// transitions with undefined transitions are also internal

export const wordMachine = Machine({
    id: 'wordmachine',
    context: {
        
    },
    initial: 'left',
    states: {
        left: {},
        right: {},
        center: {},
        justify: {}
    },
    on: {
        'LEFT-CLICK': '.left', // if external, 'word' (the root state node will be exited and re-entered again)
        'RIGHT-CLICK': '.right',
        'CENTER-CLICK': '.center',
        'JUSTIFY-CLICK': '.justify'
    }
    // global transitions, work for all of the states
})