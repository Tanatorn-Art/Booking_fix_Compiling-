"use server"
export async function fetchCarDetails() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/carsDetails/`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch car details');
    }

    const result = await response.json();

    // ตรวจสอบว่า result.Carreserve มีข้อมูลหรือไม่
    return Array.isArray(result.Carreserve) ? result.Carreserve : [];
  } catch (error) {
    console.error('Error fetching car details:', error);
    return [];
  }
}
