import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react'

interface AccountDeleteionProps {
    domain: string
}

export function AccountDeleteion({domain}: AccountDeleteionProps){

    const url = `https://${domain}/account/create`

    return(
        <Html>
            <Head/>
            <Preview>Your accont has been deleted</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Your account has been fully deleted
                        </Heading>
                        <Text className='text-base text-black mt-2'>
                            Your account has been completely deleted from our servers. All information associated with your account has been permanently removed.
                        </Text>
                    </Section>
                    <Section className='bg-white text-black shadow-md mb-4 rounded-lg p-6 text-center'>
                        <Text>You will no longer receive notifications on Telegrem or email.</Text>
                        <Text>If you want to get back to our platform you can register by link bellow</Text>
                        <Link href={url} className='inline-flex items-center justify-center mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full'>
                            Register on Pupitch
                        </Link>
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