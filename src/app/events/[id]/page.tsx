"use client";
import { use, useEffect, useState, useRef } from "react";
import { EventDetails } from "@/src/components/EventDetails";
import { ImgCarousel } from "@/src/components/ImgCarousel";
import { LoadingPage } from "@/src/components/LoadingPage";
import { Dropdown, DropdownItem } from "flowbite-react";
import { FaShareAlt, FaTrashAlt, FaPen } from "react-icons/fa";
import { useAuth } from "@/src/context/AuthContext";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { Clipboard } from "flowbite-react";

interface ISubEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

interface IEvent {
  _id: string;
  mainTitle: string;
  locationDescription: string | undefined;
  eventImagesSrc: string[];
  capacity: number;
  lat: number;
  lng: number;
  eventLocation: string;
  subEvents: ISubEvent[];
  eventStatus: number;
  remainingCapacity: number;
  isAvailable: boolean;
  organiser: {
    fullName: string;
    _id: string;
  };
  category: {
    name: string;
  };
}

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const { id } = use(params);
  const [event, setEvent] = useState<IEvent | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const copy = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setEvent(data);
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/");
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (!event) return <LoadingPage></LoadingPage>;

  return (
    <main className="my-8 flex grow flex-col items-center bg-white dark:bg-gray-900">
      <div className="relative flex w-full grow flex-col items-center">
        {(user?.id === event.organiser._id || user?.role === "admin") && (
          <Dropdown
            className="absolute top-0 right-[15%] z-50 px-3"
            theme={{
              arrowIcon: "m-0 h-8 w-8 text-black dark:text-white",
              floating: {
                target:
                  "cursor-pointer bg-transparent hover:bg-black/10 focus:ring-0 dark:bg-transparent dark:hover:bg-black/20",
              },
            }}
          >
            <DropdownItem
              icon={FaPen}
              onClick={() => router.push(`/events/${id}/edit`)}
            >
              Edit Event
            </DropdownItem>
            <DropdownItem onClick={() => setOpenModal(true)} icon={FaTrashAlt}>
              Delete Event
            </DropdownItem>
            <DropdownItem
              //@ts-ignore
              onClick={() => copy.current?.click()}
              icon={FaShareAlt}
            >
              Share Event{" "}
            </DropdownItem>
            <Clipboard
              ref={copy}
              className="hidden"
              valueToCopy={`http://localhost:3000/events/${id}`}
            ></Clipboard>
          </Dropdown>
        )}
        <ImgCarousel images={event.eventImagesSrc} />
        <EventDetails eventDetails={event} />
        <Modal
          show={openModal}
          size="md"
          onClose={() => setOpenModal(false)}
          popup
        >
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this Event?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={handleDelete}>
                  Yes, I'm sure
                </Button>
                <Button color="alternative" onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </main>
  );
}
