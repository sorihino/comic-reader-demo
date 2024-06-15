import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='md:max-w-screen-md lg:max-w-screen-lg m-auto'>
      <Header />
      <section className='py-4 mx-4'>{children}</section>
      <Footer />
    </main>
  )
}
