import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement chart of accounts listing logic
  return new Response(JSON.stringify({ message: "GET chart of accounts endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  // TODO: Implement chart of accounts creation logic
  return new Response(JSON.stringify({ message: "POST chart of accounts endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: NextRequest) {
  // TODO: Implement chart of accounts update logic
  return new Response(JSON.stringify({ message: "PUT chart of accounts endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: NextRequest) {
  // TODO: Implement chart of accounts deletion logic
  return new Response(JSON.stringify({ message: "DELETE chart of accounts endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}