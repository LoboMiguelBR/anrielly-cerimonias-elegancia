import React from "react";
import EventTasks from "./EventTasks";

const TimelineEvento = ({ eventId, onBack }: { eventId: string, onBack?: () => void }) => {
  return (
    <div className="space-y-4">
      <EventTasks eventId={eventId} />
    </div>
  );
};

export default TimelineEvento;
