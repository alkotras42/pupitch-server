import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react'
interface PasswordRecoveryTemplateProps {
    domain: string;
    token: string;
    metadata: SessionMetadata
}

export const PasswordRecoveryTemplate = ({ token, domain, metadata }: PasswordRecoveryTemplateProps) => {

    const resetLink = `${domain}/account/recovery/${token}`

    return (
        <Html>
            <Head/>
            <Preview>Password recovery</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Recover your password
                        </Heading>
                        <Text className='text-base text-black'>
                            To reset your password, please click the button below.
                        </Text>
                        <Link href={resetLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium bg-[#18B9AE] text-white px-5 py-2'>
                            Reset password
                        </Link>
                    </Section>
                    <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
                            <Heading className='text-xl font-semibold mb-4 text-[#18B9AE]'>
                                Info about request
                            </Heading>
                            <ul className='list-disc list-inside text-black mt-2'>
                                <li>Location: {metadata.location.country}</li>
                                <li>OS: {metadata.device.os}</li>
                                <li>Browser: {metadata.device.browser}</li>
                                <li>IP-adress: {metadata.ip}</li>
                            </ul>
                            <Text className='text-gray-600 mt-2'>If you not make a requset to reset your passowrd please ignore this message</Text>
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