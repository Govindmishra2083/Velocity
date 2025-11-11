import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return Response.json(users);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newUser = await User.create(data);
    return Response.json(newUser);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create user" }), { status: 500 });
  }
}
