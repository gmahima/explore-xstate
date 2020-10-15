import Head from 'next/head'
import styled, {css} from 'styled-components'
import tw from 'twin.macro'
import {toggleService} from '../machines/toggleMachine'
const Container = styled.div`
${tw `
 bg-testing-100 min-h-screen text-testing-200 flex flex-col
`}
`

export default function Home() {
  toggleService.start()
  return (
    <Container>
      <div css={tw`font-bold text-lg bg-gray-100 m-64 p-4 rounded`}>
        <button css={tw `border-2 rounded p-2 shadow`} onClick={() => (toggleService.send('TOGGLE'))}>toggle</button> 
        {/* sends an event to the running interpreter to trigger a transition */}
      </div>
    </Container>
  )
}
