import { useEffect, useState } from 'react'
import {interpret, Machine} from 'xstate'
// state is absract representation of a system at a specific point in time.
// a finite state machine can be in only 1 state at a time.
// state nodes collectively describe the overall state a machine can be in
// 5 types of state nodes: atomic, compound, parallel => (clildren but no initial), final, history => (parent node's most recent history state)
// the current state of a machine is represented by a State instance.

// event causes state transition. transition cannot occur without external stimulus

// const timerEvent = {
//     type: 'TIMER'
//   }; ====
//   const timerEvent = 'TIMER';

const keyDownEvent = {
    type: 'keydown',
    key: 'Enter'
  };

export const LightMachine = Machine(
    {
        id: 'light',
        initial: 'green',
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
                    NEXT: 'yellow',
                    keyDownEvent: 'yellow'
                }
                
            },
            yellow: {
                on: {
                    NEXT: 'red',
                    keyDownEvent: 'red'
                },
                meta: {
                    message: 'some additional info: I panic when the yellow light comes up'
                }
            },
            red: {
                type: 'parallel',
                states: {
                    walksign: {
                        initial: 'solid',
                        states: {
                            solid:{
                                on: {
                                    COUNTDOWN: 'flashing'
                                }
                            },
                            flashing: {
                                on: {
                                    STOP_COUNTDOWN: 'solid'
                                }
                            }
                        }

                    },
                    pedestrian: {
                        initial: 'walk',
                        states: {
                            walk: {
                                on: {
                                    COUNTDOWN: 'wait'
                                }
                            },
                            wait: {
                                on: {
                                    STOP_COUNTDOWN: 'stop'
                                }
                            },
                            stop: {
                                type: 'final'
                            }
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
    console.log("initial state: " , LightMachine.initialState, LightMachine.initialState.nextEvents)
    // logs a "State" object
    console.log(LightMachine.transition('yellow', 'NEXT').value) // an obj with 2 properties is logged. since, parallel states


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

const settingsMachine = Machine({
    id: 'settings',
    type: 'parallel',
    states: {
      mode: {
        initial: 'active',
        states: {
          inactive: {},
          pending: {},
          active: {}
        }
      },
      status: {
        initial: 'enabled',
        states: {
          disabled: {},
          enabled: {}
        }
      }
    },
    on: {
      // Multiple targets
      DEACTIVATE: {
        target: ['.mode.inactive', '.status.disabled'] // you can also do give multiple parallel states as a target for a transition
      }
    }
  });