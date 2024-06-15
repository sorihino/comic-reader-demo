import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'このサイトについて',
}

const About = () => {
    return (
        <>
            <h3>はじめに</h3>
            <div className='py-4'>
                <p>
                    本ウェブサイトは漫画ビューアのデモサイトです。
                    <a href='https://comicbookplus.com' target='_blank'>
                        <span className='underline'>Comic Book Plus</span>
                    </a>
                    より取得したパブリックドメインの漫画データを用いておりますが、著作権に関する問題等ございましたら
                    <a
                        className='underline'
                        href='mail:dextone.shiba@gmail.com'
                    >
                        E-Mail
                    </a>
                    にご連絡お願い申し上げます。
                </p>
            </div>
            <h3>使用技術等</h3>
            <div className='py-4'>
                <li>Next.js 14</li>
                <li>PostgreSQL</li>
                <li>Cloudinary (画像CDN)</li>
                <li>Prisma (ORM)</li>
            </div>
        </>
    )
}

export default About
