import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el  = document.documentElement
      const top = el.scrollTop || document.body.scrollTop
      const h   = el.scrollHeight - el.clientHeight
      setProgress(h > 0 ? (top / h) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      position:'fixed', top:0, left:0, zIndex:9999,
      height:3, width:`${progress}%`,
      background:'linear-gradient(90deg,#c0272d,#f87171,#c0272d)',
      backgroundSize:'200% 100%',
      transition:'width .1s linear',
      boxShadow:'0 0 8px rgba(192,39,45,.6)',
      borderRadius:'0 2px 2px 0',
    }}/>
  )
}

export default function Layout() {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <ScrollProgress />
      <Navbar />
      <main style={{ flex:1 }}><Outlet /></main>
      <Footer />
    </div>
  )
}
