"use client";
import { useEffect, useState } from "react";
import { EventCard } from "@/src/components/EventCard";
import { PaginationComponent } from "@/src/components/PaginationComponent";
import Filter from "../components/Filter";
import { Button, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { CategoriesSettingModal } from "@/src/components/modal/CategoriesSettingModal";
import { HiSearch } from "react-icons/hi";

interface ISubEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

interface IEvent {
  id: string;
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
  };
  category: {
    name: string;
  };
  description: string;
}

interface ICategory {
  name: string;
  slug: string;
  _id: string;
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [availableOnly, setAvailableOnly] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getEvents = async (limit: number, offset: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events?limit=${limit}&offset=${offset}&search=${search}&categories=${[...filters].join(",")}`,
      );
      const data = await response.json();
      setEvents(data.data);
      setTotalPages(data.meta.totalPages <= 0 ? 1 : data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddFilter = (categoryId: string, flag: boolean) => {
    setFilters((prev) => {
      const newSet = new Set(prev);

      if (flag) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }

      return newSet;
    });
  };

  useEffect(() => {
    getEvents(limit, offset);
    fetchCategories();
  }, [filters, search]);

  if (loading) {
    getEvents(limit, offset);
    return <div>Loading...</div>;
  }

  return (
    <main className="my-8 flex grow flex-col items-center justify-center gap-5 bg-white dark:bg-gray-900">
      <div className="flex w-[60%] items-center justify-center">
        <TextInput
          id="search"
          type="text"
          icon={HiSearch}
          placeholder="Search events by name..."
          required
          className="w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex w-[60%] items-center justify-between">
        <div className="flex items-center gap-4">
          <Filter
            handleAddFilter={handleAddFilter}
            availableOnly={availableOnly}
            showAvailableOnly={setAvailableOnly}
            filters={filters}
            categories={categories}
            setCategories={setCategories}
          />
          {user?.role === "admin" && (
            <CategoriesSettingModal
              categories={categories}
              setCategories={setCategories}
            />
          )}
        </div>
        <Button
          onClick={() => {
            router.push("/events/new");
          }}
        >
          New Event
        </Button>
      </div>
      {availableOnly &&
        events
          .filter((event) => event.isAvailable)
          .map((event) => <EventCard key={event.id} Event={event} />)}

      {!availableOnly &&
        events.map((event) => <EventCard key={event.id} Event={event} />)}
      <PaginationComponent totalPages={totalPages} getEvents={getEvents} />
    </main>
  );
}
