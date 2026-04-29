"use client";
import { use, useEffect, useState } from "react";
import { EditEventForm } from "@/src/components/EditEventForm";
import { LoadingPage } from "@/src/components/LoadingPage";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState(null);

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

  if (!event) return <LoadingPage />;

  return (
    <main className="my-8 flex grow flex-col items-center bg-white dark:bg-gray-900">
      <EditEventForm initialData={event} />
    </main>
  );
}
