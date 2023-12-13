"use client"
import { useState } from "react"
import styles from "./page.module.css"
import TransgateConnect from "@zkpass/transgate-js-sdk"
import styled from "styled-components"
import JSONPretty from "react-json-pretty"
import { verifyMessageSignature } from "./helper"

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

const Tag = styled.div`
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
  const [result, setResult] = useState<any>()
  const [result2, setResult2] = useState<any>()

  const start = async (schemas: string[]) => {
    try {
      const connector = new TransgateConnect("82c52a0e-a1da-4f00-926c-fb7c0d379083")
      
      const isAvailable = await connector.isTransgateAvailable()
      if(!isAvailable){
        return alert('Please install zkPass TransGate')
      }

      const resultList: any[] = []
      while (schemas.length > 0) {
        const schemaId = schemas.shift() as string
        const res: any = await connector.launch(schemaId)
        resultList.push(res)
        const verifyResult = verifyMessageSignature(
          res.taskId,
          schemaId,
          res.uHash,
          res.publicFieldsHash,
          res.validatorSignature,
          res.validatorAddress
        )
        console.log("verifyResult", verifyResult)
      }
      if(resultList.length == 1){
        setResult(resultList)
      }else{
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
            <Tag>82c52a0e-a1da-4f00-926c-fb7c0d379083</Tag>
          </FormItem>
          <FormItem>
            <Label>Schema Id:</Label>
            <Tag>4548acd7173a4ec5835f290a7b43dfe6</Tag>
          </FormItem>
          <FormItem>
            <RightContainer>
              <Button onClick={() => start(["4548acd7173a4ec5835f290a7b43dfe6"])}>Start Single Schema</Button>
            </RightContainer>
          </FormItem>
          <FormItem>
            {result && (
              <JSONPretty themeClassName='custom-json-pretty' id='json-pretty' data={result}></JSONPretty>
            )}
          </FormItem>
        </FromContainer>
        <FromContainer>
          <FormItem>
            <Label>Appid:</Label>
            <Tag>82c52a0e-a1da-4f00-926c-fb7c0d379083</Tag>
          </FormItem>
          <FormItem>
            <Label>Schema Id1:</Label>
            <Tag>4548acd7173a4ec5835f290a7b43dfe6</Tag>
          </FormItem>
          <FormItem>
            <Label>Schema Id2:</Label>
            <Tag>bbc063f294a24d11b20bb3a076c34ee8</Tag>
          </FormItem>
          <FormItem>
            <RightContainer>
              <Button onClick={() => start(["4548acd7173a4ec5835f290a7b43dfe6", "bbc063f294a24d11b20bb3a076c34ee8"])}>
                Start multi-schemas
              </Button>
            </RightContainer>
          </FormItem>
          <FormItem>
            {result2 && (
              <JSONPretty themeClassName='custom-json-pretty' id='json-pretty1' data={result2}></JSONPretty>
            )}
          </FormItem>
        </FromContainer>
      </FormGrid>
    </main>
  )
}
