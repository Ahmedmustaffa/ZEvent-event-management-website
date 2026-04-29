import { Carousel } from "flowbite-react";

export function ImgCarousel({ images }: { images: string[] }) {
  return (
    <div className="h-56 w-[70%] sm:h-64 xl:h-80 2xl:h-96">
      <Carousel
        pauseOnHover
        indicators={images.length > 1}
        theme={{
          item: {
            base: "relative",
          },
          root: {
            leftControl: `${images.length == 1 ? "hidden" : ""}`,
            rightControl: `${images.length == 1 ? "hidden" : ""}`,
          },
        }}
      >
        {images.map((image, index) => (
          <img key={index} src={image} className="h-full w-full object-cover" />
        ))}
      </Carousel>
    </div>
  );
}
