"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import {
  Table,
  TableHead,
  TableBody,
  TableHeadCell,
  TableRow,
  Accordion,
  TableCell,
  Badge,
  Spinner,
  ListGroup,
  ListGroupItem,
  AccordionContent,
  AccordionTitle,
  AccordionPanel,
} from "flowbite-react";

export default function MyEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      const fetchMyEvents = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/events?organiser=${user.id}`,
            {
              credentials: "include",
            },
          );
          const data = await res.json();
          setEvents(data.data);
        } catch (error) {
          console.error("Error fetching my events:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMyEvents();
    }
  }, [user]);

  if (authLoading || loading)
    return (
      <div className="flex justify-center p-10">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="grow bg-white p-8 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold dark:text-white">
        Events I'm Organizing
      </h1>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>Event Name</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Remaining Tickets</TableHeadCell>
              <TableHeadCell>Attendees</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {events.map((event) => (
              <TableRow
                key={event._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell
                  onClick={() => router.push(`/events/${event._id}`)}
                  className="font-medium text-gray-900 dark:text-white"
                >
                  {event.mainTitle}
                </TableCell>
                <TableCell>
                  <Badge
                    color={["info", "warning", "failure"][event.eventStatus]}
                  >
                    {["Upcoming", "Ongoing", "Finished"][event.eventStatus]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {event.remainingCapacity} / {event.capacity}
                </TableCell>
                <TableCell>
                  <Accordion collapseAll>
                    <AccordionPanel>
                      <AccordionTitle className="p-2 text-xs">
                        View Enrolled Users
                      </AccordionTitle>
                      <AccordionContent className="p-2">
                        {event.enrolledUsers.length > 0 ? (
                          <ListGroup>
                            {event.enrolledUsers.map((attendee: any) => (
                              <ListGroupItem
                                key={attendee._id}
                                className="text-xs"
                              >
                                {attendee.firstName} {attendee.lastName} (
                                {attendee.email})
                              </ListGroupItem>
                            ))}
                          </ListGroup>
                        ) : (
                          <p className="text-xs text-gray-500">
                            No one enrolled yet.
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionPanel>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
