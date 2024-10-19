"use client"
import { useState } from "react"
import styles from "./page.module.css"
import styled from "styled-components"
import JSONPretty from "react-json-pretty"
import { Result } from "./types"
import { TransgateZkAppSdk } from 'transgate-o1js-sdk/lib'
import { ethers } from "ethers"

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
  const [appid1, setAppid1] = useState<string>("91d490f2-1a90-418e-bc61-eea2d64feb89")
  const [appid2, setAppid2] = useState<string>("91d490f2-1a90-418e-bc61-eea2d64feb89")
  const [value1, setValue1] = useState<string>("773b8b4ff4bc4812b691a523b164a3f0")
  const [value2, setValue2] = useState<string>("773b8b4ff4bc4812b691a523b164a3f0")
  const [value3, setValue3] = useState<string>("773b8b4ff4bc4812b691a523b164a3f0")

  const [result, setResult] = useState<any>()
  const [result2, setResult2] = useState<any>()

  const start = async (schemas: string[], appid: string) => {
    try {
      const connector = new TransgateZkAppSdk(appid)

      const isAvailable = await connector.isTransgateAvailable()
      if (!isAvailable) {
        return alert("Please install zkPass TransGate")
      }

      const resultList: any[] = []
      while (schemas.length > 0) {
        const schemaId = schemas.shift() as string

        const res = await connector.launch(schemaId) as Result
        resultList.push(res)

        console.log({ res })

        const verifyResult = connector.verifyProof(
          {
            taskId: ethers.hexlify(ethers.toUtf8Bytes(res.taskId)),
            schemaId: ethers.hexlify(ethers.toUtf8Bytes(schemaId)),
            uHash: res.uHash,
            publicFieldsHash: res.publicFieldsHash,
            validatorSignature: res.validatorSignature,
            validator: res.validatorAddress,
            allocatorSignature: res.allocatorSignature,
            recipient: res.recipient
          }
        )

        console.log("verifyResult", verifyResult.toBoolean())
      }
      if (resultList.length == 1) {
        setResult(resultList)
      } else {
        setResult2(resultList)
      }
    } catch (err) {
      alert(JSON.stringify(err))
      console.log("error", err)
    }
  }

  return (
    <main className={styles.main}>
      <Title>zkPass Transgate JS-SDK Demo</Title>
      <FormGrid>
        <FromContainer>
          <FormItem>
            <Label>Appid:</Label>
            <Input value={appid1} onInput={(e) => setAppid1(e.target.value)} />
          </FormItem>
          <FormItem>
            <Label>Schema Id:</Label>
            <Input value={value1} onInput={(e) => setValue1(e.target.value)} />
          </FormItem>
          <FormItem>
            <RightContainer>
              <Button onClick={() => start([value1], appid1)}>Start Single Schema</Button>
            </RightContainer>
          </FormItem>
          <FormItem>
            {result && <JSONPretty themeClassName='custom-json-pretty' id='json-pretty' data={result}></JSONPretty>}
          </FormItem>
        </FromContainer>
        <FromContainer>
          <FormItem>
            <Label>Appid:</Label>
            <Input value={appid2} onInput={(e) => setAppid2(e.target.value)} />
          </FormItem>
          <FormItem>
            <Label>Schema Id1:</Label>
            <Input value={value2} onInput={(e) => setValue2(e.target.value)} />
          </FormItem>
          <FormItem>
            <Label>Schema Id2:</Label>
            <Input value={value3} onInput={(e) => setValue3(e.target.value)} />
          </FormItem>
          <FormItem>
            <RightContainer>
              <Button onClick={() => start([value2, value3], appid2)}>Start multi-schemas</Button>
            </RightContainer>
          </FormItem>
          <FormItem>
            {result2 && <JSONPretty themeClassName='custom-json-pretty' id='json-pretty1' data={result2}></JSONPretty>}
          </FormItem>
        </FromContainer>
      </FormGrid>
    </main>
  )
}
