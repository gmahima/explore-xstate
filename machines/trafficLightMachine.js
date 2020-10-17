import {Machine} from 'xstate'

export const LightMachine = Machine({
    id: 'light',
    initial: 'green',
    states: {
        green: {
            on: {
                NEXT: 'yellow'
            }
        },
        yellow: {
            on: {
                NEXT: 'red'
            }
        },
        red: {
            on: {
                NEXT: 'green'
            },
            initial: 'walk',
            P_NEXT: "why",
            states:{
                walk: {
                    on: {
                        P_NEXT: 'wait'
                    }
                },
                wait: {
                    on: {
                        P_NEXT: 'walk'
                    }
                }
            }
        }
    }
})

export const testLightMachine = () => {
    console.log("initial state: " , LightMachine.initialState)
    console.log(LightMachine.transition(LightMachine.initialState, 'NEXT').value)
    console.log(LightMachine.transition('yellow', 'NEXT').value)
    console.log(LightMachine.states)
    console.log('should print p_next of wait', LightMachine.transition({red: 'wait'}, 'P_NEXT').value)
    console.log(LightMachine.transition({red: 'wait'}, 'NEXT'))
    console.log(LightMachine.transition('red', 'NEXT'))
}