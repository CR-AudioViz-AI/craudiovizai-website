export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TicketPayload {
  error_type: string;
  error_message: string;
  error_stack?: string;
  page_url: string;
  user_id?: string;
  user_email?: string;
  browser_info?: string;
  severity: "low" | "medium" | "high" | "critical";
}

// Bot assignment logic
const assignBot = (errorType: string, severity: string): string => {
  const botAssignments: Record<string, string> = {
    "api_error": "Nexus",
    "payment_error": "Finley",
    "auth_error": "Guardian",
    "ui_error": "Phoenix",
    "database_error": "Atlas",
    "network_error": "Pulse",
    "default": "Javari"
  };
  
  // Critical issues go straight to Javari
  if (severity === "critical") return "Javari";
  
  return botAssignments[errorType] || botAssignments.default;
};

// Generate ticket number
const generateTicketNumber = (): string => {
  const prefix = "CRAV";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export async function POST(request: NextRequest) {
  try {
    const payload: TicketPayload = await request.json();
    
    const ticketNumber = generateTicketNumber();
    const assignedBot = assignBot(payload.error_type, payload.severity);
    
    // Create ticket in database
    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({
        ticket_number: ticketNumber,
        error_type: payload.error_type,
        error_message: payload.error_message,
        error_stack: payload.error_stack,
        page_url: payload.page_url,
        user_id: payload.user_id,
        user_email: payload.user_email,
        browser_info: payload.browser_info,
        severity: payload.severity,
        assigned_bot: assignedBot,
        status: "open",
        created_at: new Date().toISOString(),
        auto_generated: true
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create ticket:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create ticket" },
        { status: 500 }
      );
    }

    // Log to bot activity
    await supabase.from("bot_activity_log").insert({
      bot_name: assignedBot,
      action: "ticket_assigned",
      details: { ticket_number: ticketNumber, severity: payload.severity },
      timestamp: new Date().toISOString()
    });

    // Return ticket info for user display
    return NextResponse.json({
      success: true,
      ticket: {
        number: ticketNumber,
        assigned_to: assignedBot,
        status: "open",
        message: `Ticket ${ticketNumber} was generated to address this issue. ${assignedBot} is working on it.`
      }
    });

  } catch (error) {
    console.error("Auto-ticket error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticketNumber = searchParams.get("ticket");
  const userId = searchParams.get("user_id");
  
  if (ticketNumber) {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("ticket_number", ticketNumber)
      .single();
      
    if (error || !data) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ticket: data });
  }
  
  if (userId) {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
      
    return NextResponse.json({ tickets: data || [] });
  }
  
  return NextResponse.json({ error: "Missing ticket or user_id parameter" }, { status: 400 });
}
