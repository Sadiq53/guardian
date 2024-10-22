import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../../node_modules/swiper/swiper-bundle.min.css'; 
import Image from 'next/image';
import Link from 'next/link';
// import 'swiper/swiper-bundle.min.css'; 

// If you want additional modules (e.g., pagination, navigation)
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { API_URL } from 'src/util/API_URL';


const Banner = ({data}) => {
    console.log('image', process.env.NEXT_PUBLIC_API_BASE_URL+data[0]?.desktopImage?.replace(/\\/g, '/'))
    console.log('data : ', data)
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}  // Display 1 image at a time
      navigation      
      pagination={{ clickable: true }} // Optional: add pagination dots
      loop={true}       // Optional: enable looping
    >
      {
      data &&
      Array.isArray(data) ? data?.map((image, index) => (
        <SwiperSlide key={index}>
            <div className="banner-wrapper">
                <Link href={image?.link}><a><Image className="desk-img"  src={API_URL+image?.desktopImage?.replace(/\\/g, '/')} alt="" width={1920} height={1080} /></a></Link>
                <Link href={image?.link}><a><Image className="mob-img" src={API_URL+image?.mobileImage?.replace(/\\/g, '/')} alt="" width={1920} height={1080} /></a></Link>
            </div>
         {/* <img src={image} alt={`Slide ${index}`} style={{ width: '100%' }} /> */}
        </SwiperSlide>
      )): ''}
      {
      data &&
      Array.isArray(data) ? data?.map((image, index) => (
        <SwiperSlide key={index}>
            <div className="banner-wrapper">
                <Link href={image?.link}><a><Image className="desk-img"  src={process.env.NEXT_PUBLIC_API_BASE_URL+image?.desktopImage?.replace(/\\/g, '/')} alt="" width={1920} height={1080} /></a></Link>
                <Link href={image?.link}><a><Image className="mob-img" src={process.env.NEXT_PUBLIC_API_BASE_URL+image?.mobileImage?.replace(/\\/g, '/')} alt="" width={1920} height={1080} /></a></Link>
            </div>
         {/* <img src={image} alt={`Slide ${index}`} style={{ width: '100%' }} /> */}
        </SwiperSlide>
      )): ''}
    </Swiper>
  )
}

export default Banner