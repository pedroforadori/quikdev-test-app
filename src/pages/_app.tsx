import '../styles/global.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Header from '../components/header'
import { AuthProvider } from '../contexts/auth'
import { useState } from 'react';

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <NextNProgress
        color='rgb(88 28 135 / var(--tw-bg-opacity))'
      />
      {Component.name !== "Index" && Component.name !== "Login" 
      ? <Header /> 
      : null}

      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
