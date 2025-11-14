import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement general ledger listing logic
  return new Response(JSON.stringify({ message: "GET general ledger endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  // TODO: Implement general ledger creation logic
  return new Response(JSON.stringify({ message: "POST general ledger endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: NextRequest) {
  // TODO: Implement general ledger update logic
  return new Response(JSON.stringify({ message: "PUT general ledger endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: NextRequest) {
  // TODO: Implement general ledger deletion logic
  return new Response(JSON.stringify({ message: "DELETE general ledger endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}