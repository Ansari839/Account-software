import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement dispatch entry listing logic
  return new Response(JSON.stringify({ message: "GET dispatch entry endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  // TODO: Implement dispatch entry creation logic
  return new Response(JSON.stringify({ message: "POST dispatch entry endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: NextRequest) {
  // TODO: Implement dispatch entry update logic
  return new Response(JSON.stringify({ message: "PUT dispatch entry endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: NextRequest) {
  // TODO: Implement dispatch entry deletion logic
  return new Response(JSON.stringify({ message: "DELETE dispatch entry endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}