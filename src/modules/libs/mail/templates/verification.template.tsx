import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface VerificationTemplateProps {
    domain: string
    token: string
}

export function VerificationTemplate({domain, token}: VerificationTemplateProps  ){
    const verificationLink = `${domain}/account/verify?token=${token}`

    return (
        <Html>
            <Head/>
            <Preview>Account verification</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Verify your email
                        </Heading>
                        <Text className='text-base text-black'>
                            Thank you  for signing up in Pupitch! Please verify your email address by clicking the button below.
                        </Text>
                        <Link href={verificationLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium bg-[#18B9AE] text-white px-5 py-2'>
                            Verify your email
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