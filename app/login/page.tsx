"use client";

import PageTitle from "@/components/PageTitle"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Image from "next/image"
import { signIn } from "next-auth/react"

const Login = () => {
    const onLogin = (provider: string) => () => {
        signIn(provider);
    }
        return (
            <main className='flex flex-col flex-grow items-center px-4'>
                <PageTitle title="Login Or Register" />
                <section className="flex flex-col gap-4">
                    <Button onClick={onLogin("github")}>
                        <div className="w-7 h-7 mr-3 aspect-square relative ">
                            <Image
                                alt="github icon"
                                className="w-10 h-10"
                                src={"/icons/github-mark.png"}
                                fill
                            />
                        </div>
                        Sign In With Github
                    </Button>
                    <Button onClick={onLogin("google")}>
                        <Mail className="mr-3" />
                        Sign In With Google
                    </Button>
                </section>
            </main>
        )
    }
    export default Login