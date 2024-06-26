"use client"
import { useState } from "react"
import styles from "./page.module.css"
import TransgateConnect from "@zkpass/transgate-js-sdk"
import styled from "styled-components"
import JSONPretty from "react-json-pretty"
import { Result } from "@zkpass/transgate-js-sdk/lib/types"
import { verifySolanaMessageSignature } from "../helper"

const FormGrid = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-template-columns: 800px;
  margin: 3rem auto;
`

const FromContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 1rem;
`

const Label = styled.div`
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
`

const Input = styled.input`
  display: block;
  background-color: #ffffff;
  border-radius: 5px;
  height: 35px;
  line-height: 35px;
  width: 100%;
  padding: 0 18px;
  outline: none;
  color: #000000;
`

const Button = styled.button<{ disabled?: boolean }>`
  position: relative;
  display: block;
  min-width: 120px;
  height: 35px;
  line-height: 35px;
  padding: 0 18px;
  text-align: center;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  background: #c5ff4a;
  color: var(--color-black);
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  &:active {
    border: 0.5px solid #898989;
    color: #0a0a0aab;
  }
`

const RightContainer = styled.div`
  grid-column: 2 / 3;
`

const Title = styled.h2`
  color: #ffffff;
  text-align: center;
`

export default function Home() {
  const [appid1, setAppid1] = useState<string>("39a00e9e-7e6d-461e-9b9d-d520b355d1c0")
  const [value1, setValue1] = useState<string>("c7eab8b7d7e44b05b41b613fe548edf5")
  const [result, setResult] = useState<any>()

  const start = async (schemaId: string, appid: string) => {
    try {
      if (!("phantom" in window)) {
        return alert("Please install Phantom wallet")
      }
      // @ts-ignore
      const provider = window.phantom?.solana

      const resp = await provider?.connect()
      const account = resp.publicKey.toString()
      console.log("current account", account)

      const connector = new TransgateConnect(appid)
      const isAvailable = await connector.isTransgateAvailable()
      if (!isAvailable) {
        return alert("Please install zkPass TransGate")
      }

      const res = (await connector.launchWithSolana(schemaId, account)) as Result

      const rec = res.recipient as string
      //verify the proof result 
      const verifyResult = verifySolanaMessageSignature({
        taskId: res.taskId,
        uHash: res.uHash,
        schema: schemaId,
        validatorAddress: res.validatorAddress,
        validatorSignature: res.validatorSignature,
        recipient: rec,
        publicFieldsHash: res.publicFieldsHash,
      })

      alert(JSON.stringify(verifyResult))  

    } catch (err) {
      alert(JSON.stringify(err))
      console.log("error", err)
    }
  }
  return (
    <main className={styles.main}>
      <Title>zkPass Transgate JS-SDK Demo(send to solana-devnet chain)</Title>
      <FormGrid>
        <FromContainer>
          <FormItem>
            <Label>Appid:</Label>
            <Input value={appid1} onInput={(e) => setAppid1(e.target.value?.trim())} />
          </FormItem>
          <FormItem>
            <Label>Schema Id:</Label>
            <Input value={value1} onInput={(e) => setValue1(e.target.value?.trim())} />
          </FormItem>
          <FormItem>
            <RightContainer>
              <Button onClick={() => start(value1, appid1)}>Run</Button>
            </RightContainer>
          </FormItem>
          <FormItem>
            {result && <JSONPretty themeClassName='custom-json-pretty' id='json-pretty' data={result}></JSONPretty>}
          </FormItem>
        </FromContainer>
      </FormGrid>
    </main>
  )
}
