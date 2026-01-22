import { NextResponse } from "next/server";

const AUTOMATION_URL =
  "https://app.contentstack.com/automations-api/run/cbb4ee6fb405405cb616ddf581e4c1d6";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookId, bookTitle, bookGenre, userName, userEmail } = body;

    if (!bookTitle || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Trigger Contentstack Automation
    const automationPayload = {
      name: userName,
      email: userEmail,
      book_name: bookTitle,
      genre: bookGenre || "General",
      link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/search`,
    };

    console.log("Triggering book completion automation:", automationPayload);

    const automationResponse = await fetch(AUTOMATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(automationPayload),
    });

    if (!automationResponse.ok) {
      const errorText = await automationResponse.text();
      console.error("Automation API error:", errorText);
      // Don't fail the request even if automation fails
      return NextResponse.json({
        success: true,
        automationTriggered: false,
        message: "Book completion recorded, but automation failed",
      });
    }

    const automationResult = await automationResponse.json().catch(() => ({}));
    console.log("Automation triggered successfully:", automationResult);

    return NextResponse.json({
      success: true,
      automationTriggered: true,
      message: "Book completion recorded and celebration email sent!",
    });
  } catch (error) {
    console.error("Book completion API error:", error);
    return NextResponse.json(
      { error: "Failed to process book completion" },
      { status: 500 }
    );
  }
}
