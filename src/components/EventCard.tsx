import { Button, Badge } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoTicket } from "react-icons/io5";

interface ISubEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

interface IEventCard {
  mainTitle: string;
  description: string;
  isAvailable: boolean;
  subEvents: ISubEvent[];
  id: string;
  category: {
    name: string;
  };
  eventImagesSrc: string[];
}

export function EventCard({ Event }: { Event: IEventCard }) {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(`/events/${Event.id}`);
      }}
      className="flex min-h-60 w-[60%] flex-col rounded-lg border border-gray-200 bg-white shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="order-2 flex w-full flex-col justify-center p-6 md:order-1">
        <section className="mb-2 flex items-center gap-2">
          <h5 className="cursor-pointer text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {Event.mainTitle}
          </h5>
          <Badge className="cursor-default rounded-full">
            {Event.category ? Event.category?.name : "No Category"}
          </Badge>
        </section>
        <ul className="mb-3 ml-3 text-gray-700 dark:text-gray-300">
          {Event.subEvents.map((subEvent, index) => (
            <li key={index}>
              {index + 1} - {subEvent.title}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button disabled={!Event.isAvailable}>
            <IoTicket className="mr-2 h-5 w-5" />
            Enroll now
          </Button>
          <Button className="cursor-pointer">
            Read more
            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <img
        src={Event.eventImagesSrc[0]}
        className="order-1 h-96 w-full rounded-t-lg object-cover md:order-2 md:h-auto md:w-48 md:rounded-none md:rounded-r-lg"
        alt=""
      />
    </div>
  );
}
