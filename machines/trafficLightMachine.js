import { useEffect, useState } from 'react'
import {interpret, Machine} from 'xstate'

export const LightMachine = Machine(
    {
        id: 'light',
        initial: 'red',
        //context is extended state for all the states in machine
        context: {
            // initial context:
            elapsed: 0,
            direction: 'east'
        },
        states: {
            green: {
                entry: 'alertGreen',//action to be called on entering this node, is referenced as a string
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
    }, {
        // defined as objs in second arg, can be referenced from machine as a string!
        actions: {
            alertGreen: (context, event) => {alert("Entered Green!!!")}
        },
        guards: {},
        services: {},
        activities: {}
    }
)

export const testLightMachine = () => {
    console.log("initial state: " , LightMachine.initialState)
    console.log(LightMachine.transition(LightMachine.initialState, 'NEXT').value)
    console.log(LightMachine.transition('yellow', 'NEXT').value)
    console.log(LightMachine.states)
    console.log('should print p_next of wait', LightMachine.transition({red: 'wait'}, 'P_NEXT').value)
    console.log(LightMachine.transition({red: 'wait'}, 'NEXT'))
    console.log(LightMachine.transition('red', 'NEXT'))
}

export const useLightMachine = () => {
    const lightService = interpret(LightMachine)
    //let [state, setState] = useState(lightService.initialState)
    useEffect(() => {
        lightService.start()
        //setState(lightService.state)
        return () => {lightService.stop()}
    }, [])
    const sendTransition = (transition) => {lightService.send(transition)}
    return {
        sendTransition
        //,state
    }
}
// my guess: useMachine does something like the above internally i.e. interpret the machine into a service, start it, take in transitions and send them etc. (while maintaining state)

const AnotherLightMachine = LightMachine.withContext({
    elaplsed: 1000,
    direction: 'north'
})
// creating another lightmachine by extending lightMachine with a different initial context, which is going to replace the original initial context completely
// you can do this though:

const Another2LightMachine = LightMachine.withContext({
    ...LightMachine.context, //accessing original initial context
    elaplsed: 1000
})