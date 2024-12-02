// fetchEventDetails.ts
"use server"
export async function fetchEventDetails() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/bookingrooms/`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();
  return result.meetingRooms;
}
