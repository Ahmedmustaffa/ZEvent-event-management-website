"use client";

import {
  HRText,
  Button,
  Timeline,
  HelperText,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
} from "flowbite-react";
import { useReactToPrint } from "react-to-print";
import { EventTimeLine } from "./EventTimeLine";
import { IoTicket } from "react-icons/io5";
import dynamic from "next/dynamic";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { useState, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const MiniMap = dynamic(
  () => import("@/src/components/MiniMap").then((m) => m.default),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  },
);

interface ISubEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

interface IEventDetails {
  mainTitle: string;
  capacity: number;
  lat: number;
  lng: number;
  eventLocation: string;
  subEvents: ISubEvent[];
  eventStatus: number;
  remainingCapacity: number;
  locationDescription: string | undefined;
  isAvailable: boolean;
  organiser: {
    fullName: string;
    _id: string;
  };
  category: {
    name: string;
  };
  _id: string;
}

export function EventDetails({
  eventDetails,
}: {
  eventDetails: IEventDetails;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [errorState, setErrorState] = useState<{
    message: string;
    flag: boolean;
  }>();
  const [openModal, setOpenModal] = useState(false);
  const [ticketHolderData, setTicketHolderData] = useState<{
    fullName: string;
    email: string;
  } | null>();
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const TicketToPrint = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: TicketToPrint });

  const handleEnroll = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: eventDetails._id }),
        credentials: "include",
      });
      if (response.ok) {
        eventDetails.remainingCapacity -= 1;
        showToast("Enrolled successfully!", "success");
      } else {
        const res = await response.json();
        showToast(res.message, "failure");
      }
    } catch (error) {
      console.error("Error enrolling in event:", error);
    }
  };

  const takeAttendance = async (ticketId: string) => {
    const checkTicket = await fetch(
      `http://localhost:5000/api/tickets/${ticketId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (checkTicket.ok) {
      const ticketData = await checkTicket.json();
      if (ticketData.event._id === eventDetails._id) {
        const response = await fetch(
          `http://localhost:5000/api/tickets/${ticketId}/use`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ eventId: eventDetails._id }),
            credentials: "include",
          },
        );
        if (response.ok) {
          const res = await response.json();
          setTicketHolderData(res.ticket.user);
          setShowTicketInfo(true);
        } else {
          const res = await response.json();
          setErrorState({ message: res.message, flag: true });
        }
      } else {
        showToast("This ticket is not valid.", "failure");
      }
    } else {
      showToast("This ticket is not valid.", "failure");
    }
  };

  return (
    <div className="z-10 grid w-[70%] grow grid-cols-1 rounded-b-lg border-2 border-t-0 border-gray-300 lg:grid-cols-4 dark:border-gray-700">
      <div className="border-r border-gray-300 pt-3 pr-5 pl-5 lg:col-span-3 dark:border-gray-700">
        <h1 className="mb-4 text-2xl leading-none font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {eventDetails?.mainTitle}
        </h1>
        <Timeline>
          {eventDetails?.subEvents.map((subEvent, index) => (
            <EventTimeLine
              key={index}
              startDate={subEvent.startDate}
              endDate={subEvent.endDate}
              title={subEvent.title}
              description={subEvent.description}
              completed={subEvent.completed}
            ></EventTimeLine>
          ))}
        </Timeline>
      </div>
      <div className="flex grow flex-col items-center gap-2 lg:col-span-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Event Location
        </h2>
        <div className="w-full">
          <p className="ml-2 text-gray-900 dark:text-white">
            {eventDetails.eventLocation}
          </p>
          <MiniMap pos={[eventDetails.lat, eventDetails.lng]}></MiniMap>
          <HelperText className="ml-2">
            {eventDetails.locationDescription
              ? eventDetails.locationDescription
              : undefined}
          </HelperText>
        </div>
        <HRText
          text="Event Details"
          theme={{
            base: "relative",
          }}
        />
        <div className="flex w-full grow flex-col items-start gap-5 text-gray-900 dark:text-white">
          <div className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
            Maximum capacity: {eventDetails.capacity}
          </div>
          <div className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
            Remaining tickets:{" "}
            {
              <HelperText
                className="inline text-lg"
                color={
                  eventDetails.remainingCapacity === 0 ? "failure" : undefined
                }
              >
                {eventDetails.remainingCapacity}
              </HelperText>
            }
          </div>
          <div className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
            Event status:{" "}
            <HelperText
              className="inline text-lg"
              color={
                ["success", "warning", "failure"][eventDetails.eventStatus]
              }
            >
              {
                ["Not started", "In progress", "Completed"][
                  eventDetails.eventStatus
                ]
              }
            </HelperText>
          </div>
          <div className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
            Event organiser: {eventDetails.organiser.fullName}
          </div>
          <div className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
            Event category:{" "}
            {eventDetails.category
              ? eventDetails.category?.name
              : "No Category"}
          </div>
        </div>
        {user?.id !== eventDetails.organiser._id ? (
          <Button
            className="my-5"
            disabled={!eventDetails.isAvailable}
            onClick={handleEnroll}
          >
            <IoTicket className="mr-2 h-5 w-5" />
            Enroll now
          </Button>
        ) : (
          <Button className="my-5" onClick={() => setOpenModal(true)}>
            <IoTicket className="mr-2 h-5 w-5" />
            Check Tickets
          </Button>
        )}
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
        dismissible
      >
        <ModalHeader />
        <ModalBody>
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Scan the ticket QR Code
            </h1>
            <Scanner
              styles={{ container: { width: "16rem", height: "16rem" } }}
              onScan={(result) => {
                takeAttendance(result[0].rawValue);
              }}
            />
            {errorState?.flag && (
              <HelperText color="failure">{errorState.message}</HelperText>
            )}
            {showTicketInfo && ticketHolderData && (
              <>
                <h2 className="my-3">Ticket Information</h2>
                <Card ref={TicketToPrint}>
                  <p>Name: {ticketHolderData.fullName}</p>
                  <p>Email: {ticketHolderData.email}</p>
                </Card>
              </>
            )}
            <Button
              className="my-5"
              disabled={!showTicketInfo}
              onClick={reactToPrintFn}
            >
              Print
            </Button>
            <Button
              onClick={() => {
                setTicketHolderData(null);
                setShowTicketInfo(false);
                setErrorState({ message: "", flag: false });
              }}
            >
              Reset
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
