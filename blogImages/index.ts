import image from 'next/image';
import blogImage1 from '@/public/blog/thumbnail_0.jpg'
import blogImage2 from '@/public/blog/thumbnail_1.jpg'

const blogImages: any = [
    { image: blogImage1, id: 1, url: '/blog/thumbnail_0.jpg'},
    { image: blogImage2, id: 2, url: '/blog/thumbnail_1.jpg'},
    // { image: blogImage1, id: 3, url: '/blog/thumbnail_0.jpg'},
    // { image: blogImage1, id: 4, url: '/blog/thumbnail_0.jpg'},
]

export default blogImages;