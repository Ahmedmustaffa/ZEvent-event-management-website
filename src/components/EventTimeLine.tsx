"use client";

import {
  Button,
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";
import { IoCheckmark } from "react-icons/io5";

interface ISubEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

export function EventTimeLine({
  title,
  completed,
  description,
  startDate,
  endDate,
}: ISubEvent) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <TimelineItem
      theme={{
        point: {
          marker: {
            icon: {
              wrapper: completed
                ? "bg-green-200 dark:bg-green-700"
                : "bg-gray-200 dark:bg-gray-700",
              base: "text-black dark:text-white",
            },
          },
        },
      }}
    >
      <TimelinePoint icon={IoCheckmark} />
      <TimelineContent>
        <TimelineTime>
          {formatDate(startDate)} ~ {formatDate(endDate)}
        </TimelineTime>
        <TimelineTitle>{title}</TimelineTitle>
        <TimelineBody>{description} </TimelineBody>
      </TimelineContent>
    </TimelineItem>
  );
}
