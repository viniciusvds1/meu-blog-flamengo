"use client";

import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel() {
  const images = [
    {
      src: "/assets/flamengo2.jpg",
      alt: "Torcida do Flamengo comemorando no estádio",
    },
    {
      src: "/assets/flamengo4.jpg",
      alt: "Escudo do Flamengo",
    },
    {
      src: "/assets/flamengo5.jpg",
      alt: "torcida",
    },
  ];
  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        className="btn btn-circle absolute left-5 top-1/2 transform -translate-y-1/2 z-10 bg-opacity-50 bg-black text-white hover:bg-opacity-75"
        onClick={onClick}
        aria-label="Anterior Slide"
      >
        ❮
      </button>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        className="btn btn-circle absolute right-5 top-1/2 transform -translate-y-1/2 z-10 bg-opacity-50 bg-black text-white hover:bg-opacity-75"
        onClick={onClick}
        aria-label="Próximo Slide"
      >
        ❯
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <ul className="slick-dots"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <button className="w-3 h-3 bg-gray-300 rounded-full mx-1 focus:outline-none"></button>
    ),
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="w-full">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[700px]">
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
