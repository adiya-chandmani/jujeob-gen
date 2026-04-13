import Head from "next/head";
import { JujeobMachine } from "@/components/jujeob-machine";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>주접자판기</title>
        <meta name="description" content="이름과 상황에 맞춰 주접 멘트를 뽑아주는 웹서비스" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <JujeobMachine />
    </>
  );
}
