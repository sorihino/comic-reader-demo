import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex border-b-2 py-4 mx-4 space-x-4 items-center'>
      <Link href='/'>トップ</Link>
      <Link href='/about'>このサイトについて</Link>
    </header>
  )
}

export default Header
