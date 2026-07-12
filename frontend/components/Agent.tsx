    'use client'

    import React, { useEffect, useState } from 'react'
    import Image from 'next/image'
    import AILogo from '../public/images/AILogo.png'
    import { cn } from '@/lib/utils'
    import  user  from '../public/images/user-icon.webp'
    import { useRouter } from 'next/navigation'
    import { vapi } from '@/lib/vapi.sdk'

    enum CallStatus {
        INACTIVE = 'INACTIVE',
        CONNECTING = 'CONNECTING',
        ACTIVE = 'ACTIVE',
        FINISHED = 'FINISHED'
    }
    interface SavedMessage{
        role: 'user' | 'system' | 'assistant'
        content: string
    }
    const Agent = ({ userName, userId, type, interviewId, questions}: AgentProps) => {
        const router = useRouter();
        const [isSpeaking , setIsSpeaking] = useState(false)
        const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
        const [messages, setMessages] = useState<SavedMessage[]>([])
        const lastMessage = messages[messages.length - 1];

        useEffect(() => {
            const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
            const onCallEnd  = () => setCallStatus(CallStatus.FINISHED)

            const onMessage = (message: Message) => {
                if(message.type === 'transcript' && message.transcriptType === 'final'){
                    const newMessage = { role: message.role , content: message.transcript}

                    setMessages((prev) => [...prev , newMessage])
                }
            }

            const onSpeechStart = () => setIsSpeaking(true)
            const onSpeechEnd = () => setIsSpeaking(false)

            const onError = (error: Error) => console.log('Error' , error)

            vapi.on('call-start', onCallStart)
            vapi.on('call-end', onCallEnd)
            vapi.on('message', onMessage)
            vapi.on('speech-start', onSpeechStart)
            vapi.on('speech-end', onSpeechEnd)
            vapi.on('error', onError)

            return () => {
                vapi.off('call-start', onCallStart)
                vapi.off('call-end', onCallEnd)
                vapi.off('message', onMessage)
                vapi.off('speech-start', onSpeechStart)
                vapi.off('speech-end', onSpeechEnd)
                vapi.off('error', onError)
            }

        }, [])

        useEffect(() => {
            if(callStatus === CallStatus.FINISHED) router.push('/')


        }, [messages, callStatus, type, userId])

        const handleCall = async () => {
             setCallStatus(CallStatus.CONNECTING)
             if(type === 'generate'){
             await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_GENERATE_ID!, {
                  variableValues: {
                     userName: userName,
                     userId: userId

                  }
             })
            }
            else{
                await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_INTERVIEW_ID!, {
                    variableValues: {
                        interviewId: interviewId,
                         userId: userId,
                        questions: questions

                    }
                })
            }

        }
        const handleDisconnect = async () => {
            setCallStatus(CallStatus.FINISHED)
            vapi.stop()
           
        }

        const latestMessage = messages[messages.length - 1] ?.content;
        const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED

      return (
        <>
        <div className='call-view flex justify-center -mt-8 mb-0 scrollbar-hidden'>
            <div className='card-interview w-96 h-72 flex justify-center items-center '>
                 <div className='avatar '>
                       <Image src={AILogo} alt='vepi'  className='object-cover ' />
                       {isSpeaking && <span className='animate-speak'/>}
                 </div>
                 <h3>AI Interviwer</h3>
            </div>
            <div className='card-interview w-96 h-72 flex justify-center items-center '>
                <div className='card-content'>
                    <Image src={user} alt="user avatar"  width={540} height={540} className='object-cover rounded-full size-[132px]'/> 
                    <h3>{userName}</h3>
                </div>

            </div>
        
        </div>

             {messages.length > 0 && (
                <div className='transcript-border mb-0'>
                    <div className='transcript'>
                        <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0' , 'animate-fadeIn opacity-100')}>
                            {latestMessage}
                        </p>
                    </div>

                </div>
             )}

        <div className='w-full flex justify-center -mt-8 mb-0'>
            {callStatus !== CallStatus.ACTIVE ? (
                <button className='relative btn-call' onClick={handleCall }>
                    <span className={cn('absolute animate-ping rounded-full opacity-75' , callStatus !== CallStatus.CONNECTING && 'hidden')}/>
                        <span>
                            {isCallInactiveOrFinished ? 'Start' : '...'}
                        </span>
                </button>
            ) : (
                <button className='btn-disconnect' onClick={handleDisconnect}>
                    End
                </button>
            )
            }
        </div>
        </>
      )
    }

    export default Agent


    