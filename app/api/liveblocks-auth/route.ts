import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const mysecret = process.env.LIVEBLOCKS_SECRET_KEY;
const liveblocks = new Liveblocks({
  secret: mysecret,
});

// Function to get user from session/cookie
async function getUserFromSession(request: NextRequest) {
  try {
    // Get the session token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      // Return a default guest user if no token is found
      return {
        id: `guest-${Math.random().toString(36).substring(2, 10)}`,
        metadata: {
          name: "Guest User",
          avatar: "https://via.placeholder.com/150",
        }
      };
    }
    
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { 
      id: string;
      name: string;
      email: string;
    };
    
    return {
      id: decoded.id,
      metadata: {
        name: decoded.name,
        email: decoded.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${decoded.name}`,
      }
    };
  } catch (error) {
    // Return a default guest user if token verification fails
    return {
      id: `guest-${Math.random().toString(36).substring(2, 10)}`,
      metadata: {
        name: "Guest User",
        avatar: "https://via.placeholder.com/150",
      }
    };
  }
}

export async function POST(request: NextRequest) {
  // Get the current user from the session
  const user = await getUserFromSession(request);

  // Get the room ID from the request if available
  let roomId: string | undefined;
  try {
    const body = await request.json();
    roomId = body.room;
  } catch (error) {
    // No room ID in the request, will use identifyUser
  }

  if (roomId) {
    // If we have a room ID, use prepareSession for more granular control
    const session = liveblocks.prepareSession(user.id, {
      userInfo: user.metadata
    });

    // Grant access to the specific room
    session.allow(roomId, session.FULL_ACCESS);

    // Authorize the session
    const { status, body } = await session.authorize();
    return new Response(body, { status });
  } else {
    // If no room ID, use identifyUser for general authentication
    const { status, body } = await liveblocks.identifyUser({
      userId: user.id,
      groupIds: [], // Empty array for groupIds
    }, {
      userInfo: user.metadata,
    });

    return new Response(body, { status });
  }
}