import { Card } from "flowbite-react";
import { QRCodeSVG } from "qrcode.react";

export function TicketQRCode({
  ticketId,
  eventName,
}: {
  ticketId: string;
  eventName: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {eventName}
      </h1>
      <div className="hidden flex-col items-center gap-4 dark:flex">
        <h2 className="text-xl font-semibold dark:text-gray-400">
          Your Ticket QR Code
        </h2>
        <QRCodeSVG value={ticketId} size={200} bgColor="#1f2937" />
        <p className="text-sm text-gray-500">
          Show this QR code at the event entrance.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 dark:hidden">
        <h2 className="text-xl font-semibold dark:text-gray-400">
          Your Ticket QR Code
        </h2>
        <QRCodeSVG value={ticketId} size={200} />
        <p className="text-sm text-gray-500">
          Show this QR code at the event entrance.
        </p>
      </div>
    </div>
  );
}
