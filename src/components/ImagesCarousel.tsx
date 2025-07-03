import Image from "next/image";

export default function ImagesCarousel() {
  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <div className="carousel-track" id="carouselTrack">
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_4.png"
              alt="Produto 1"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_5.png"
              alt="Produto 2"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_6.png"
              alt="Produto 3"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_7.png"
              alt="Produto 4"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_8.png"
              alt="Produto 5"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_10.png"
              alt="Produto 6"
              width={200}
              height={200}
            />
          </div>

          {/* Duplicação para efeito infinito */}
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_4.png"
              alt="Produto 1"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_5.png"
              alt="Produto 2"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_6.png"
              alt="Produto 3"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_7.png"
              alt="Produto 4"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_8.png"
              alt="Produto 5"
              width={200}
              height={200}
            />
          </div>
          <div className="carousel-slide">
            <Image
              src="/carousel/carousel_image_10.png"
              alt="Produto 6"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
