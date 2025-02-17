import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react'

interface DeactivateTemplateProps {
	metadata: SessionMetadata,
    token: string
}

export function DeactivateTemplate({token, metadata}: DeactivateTemplateProps){


    return(
        <Html>
            <Head/>
            <Preview>Account deactivation</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Deactivate your account
                        </Heading>
                        <Text className='text-base text-black'>
                            We're sorry to see you go. If you're sure you want to deactivate your account, please enter the verification code below. 
                        </Text>
                    </Section>
                    <Section className='bg-gray-100 rounded-lg p-6 text-center'>
                        <Heading className='text-2xl text-black font-semibold'>Verification code</Heading>
                    </Section>
                    <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
                            <Heading className='text-xl font-semibold mb-4 text-[#18B9AE]'>
                                Info about request
                            </Heading>
                            <Heading className='text-3xl text-black font-semibold'>
                                {token}
                            </Heading>
                            <Text className='text-black'>
                                This code will expire in 5 minutes.
                            </Text>
                            <ul className='list-disc list-inside text-black mt-2'>
                                <li>Location: {metadata.location.country}</li>
                                <li>OS: {metadata.device.os}</li>
                                <li>Browser: {metadata.device.browser}</li>
                                <li>IP-adress: {metadata.ip}</li>
                            </ul>
                            <Text className='text-gray-600 mt-2'>If you not make a requset to deactivate your account please ignore this message</Text>
                    </Section>
                    <Section className='text-center mt-8'>
                        <Text className='text-gray-600'>
                            If you have any questions, or if you face any issues with your account, please don't hesitate to contact us at {' '}
                            <Link href='mailto:support@pupitch.com' className='text-blue-500'>support@pupitch.com</Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}