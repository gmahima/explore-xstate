import {interpret, Machine} from 'xstate'

const timeMachine = Machine({
    id: 'time',
    initial: 'unknown',
    context: {
        time: undefined
    },
    states: {
        // transient state => specifies transitions for the null event (which happens immediately once a state is entered)
        unknown: {
            on: {
                '': [
                    {target: 'morning', cond: 'isBeforeNoon'},
                    {target: 'afternoon', cond: 'isBeforeSix'},
                    {target: 'evening'}
                ]
            }
        },
        morning: {},
        afternoon: {},
        evening: {}
    }
}, {
    guards: {
        isBeforeNoon: (context, event, rest) => {console.log(rest); context.time && context.time.getHours() < 12},
        isBeforeSix: (context,event, rest) => {console.log(rest); context.time && context.time.getHours() < 18}
    }
})

export const timeService = interpret(timeMachine.withContext({time: new Date()})).onTransition(state => console.log(state.value)).start()