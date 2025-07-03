import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import banner1 from "../../public/banner1.avif";
import banner2 from "../../public/banner2.avif";

export default function Hero() {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        allowTouchMove={true}
      >
        <SwiperSlide>
          <Image
            src={banner1}
            alt="Banner 1"
            priority
            width={2048}
            height={683}
            sizes="100vw"
            className="w-full object-cover h-auto"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={banner2}
            alt="Banner 2"
            priority
            width={2048}
            height={683}
            sizes="100vw"
            className="w-full object-cover h-auto"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
