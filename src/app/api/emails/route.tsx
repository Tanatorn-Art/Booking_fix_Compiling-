import { sendEmail } from "@/utils/mail.utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // รับค่าจาก body ของ request
    const sender = {
      name: "Reservation System",
      address: "no-reply@example.com", // ตั้งอีเมลผู้ส่ง
    };

    const recipients = [
      {
        name: "Admin",
        address: "admin@example.com", // อีเมลผู้รับ
      },
    ];

    const emailContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #0066CC; text-align: center; font-size: 28px; margin-bottom: 20px;">
        New Reservation Submitted
      </h1>
      <p style="font-size: 18px; line-height: 1.6; margin-bottom: 10px;">
        <strong style="font-size: 20px; color: #0066CC;">Details:</strong>
      </p>
      <ul style="font-size: 18px; line-height: 1.8; padding-left: 20px;">
        <li><strong style="color: #0066CC;">Event:</strong> ${body.eventName}</li>
        <li><strong style="color: #0066CC;">Department:</strong> ${body.departmentName}</li>
        <li><strong style="color: #0066CC;">Date:</strong> ${body.Start_date} to ${body.End_date}</li>
        <li><strong style="color: #0066CC;">Time:</strong> ${body.Start_time} to ${body.End_time}</li>
        <li><strong style="color: #0066CC;">Participants:</strong> ${body.participant}</li>
        <li><strong style="color: #0066CC;">Room:</strong> ${body.roomName}</li>
        <li><strong style="color: #0066CC;">Equipment:</strong> ${body.equipmentUse}</li>
        <li><strong style="color: #0066CC;">Notes:</strong> ${body.notes}</li>
      </ul>
      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:3000/authentication/login" style="
          display: inline-block;
          background-color: #0066CC;
          color: #fff;
          font-size: 18px;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: bold;">
          Confirm Reservation
        </a>
      </div>
      <p style="text-align: center; font-size: 16px; color: #777; margin-top: 20px;">
        Thank you for using our reservation system.
      </p>
    </div>
  `;



    const result = await sendEmail({
      sender,
      receipients: recipients,
      subject: `New Reservation: ${body.eventName}`,
      message: emailContent,
    });

    return NextResponse.json({
      accepted: result.accepted,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return NextResponse.json(
      { message: "Unable to send email at this time" },
      { status: 500 }
    );
  }
}
