"use client";
import { useEffect, useState } from "react";
import { TicketQRCode } from "@/src/components/ticketQRCode";
import {
  Card,
  Button,
  Modal,
  ModalBody,
  Badge,
  Spinner,
  ModalHeader,
} from "flowbite-react";
import Link from "next/link";

export default function Tickets() {
  const [ticketsData, setTicketsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tickets", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setTicketsData(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleShowTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setOpenModal(true);
  };

  if (loading)
    return (
      <div className="flex grow items-center justify-center">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="flex grow flex-col items-center bg-white py-10 dark:bg-gray-900">
      <h1 className="mb-10 text-4xl font-bold text-gray-900 dark:text-white">
        My Tickets
      </h1>

      <div className="grid w-[80%] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ticketsData.map((ticket) => (
          <Card
            key={ticket._id}
            imgSrc={
              ticket.event?.eventImagesSrc?.[0] || "/placeholder-event.jpg"
            }
            className="overflow-hidden"
            theme={{ img: { base: "max-h-50 object-cover" } }}
          >
            <Link href={`/events/${ticket.event?._id}`}>
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-500">
                {ticket.event?.mainTitle}
              </h5>
            </Link>

            <div className="mt-4 flex items-center justify-between">
              <Badge
                color={
                  ticket.status === "active"
                    ? "success"
                    : ticket.status === "used"
                      ? "gray"
                      : "failure"
                }
                className="text-sm uppercase"
              >
                {ticket.status}
              </Badge>

              <Button size="sm" onClick={() => handleShowTicket(ticket)}>
                Show Ticket
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="md"
        popup
        dismissible
      >
        <ModalHeader />
        <ModalBody>
          {selectedTicket && (
            <div className="flex flex-col items-center">
              <TicketQRCode
                ticketId={selectedTicket._id}
                eventName={selectedTicket.event?.mainTitle}
              />
              <p className="mt-4 text-center text-sm text-gray-500">
                Status:{" "}
                <span className="font-bold">
                  {selectedTicket.status.toUpperCase()}
                </span>
              </p>
            </div>
          )}
        </ModalBody>
      </Modal>
    </main>
  );
}
