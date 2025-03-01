"use client";

import { RoomProvider } from "../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { ReactNode } from "react";
import { LiveMap } from "@liveblocks/client";

interface RoomProps {
  children: ReactNode;
  roomId: string;
}

export default function Room({ children, roomId }: RoomProps) {
  // For the home page, we'll use a simpler setup with minimal presence data
  const isHomePage = roomId === "home-page";

  return (
    <RoomProvider
      id={roomId}
      initialPresence={isHomePage ? 
        {
          cursor: null,
          selection: null,
          currentTool: null,
          color: "#E57373", // Default color for home page
        } : 
        {
          cursor: null,
          selection: null,
          currentTool: null,
          color: getRandomColor(),
        }
      }
      initialStorage={isHomePage ?
        {
          elements: new LiveMap(),
          canvasSettings: {
            width: 1200,
            height: 800,
            background: "#ffffff",
          },
        } :
        {
          elements: new LiveMap(),
          canvasSettings: {
            width: 1200,
            height: 800,
            background: "#ffffff",
          },
        }
      }
    >
      <ClientSideSuspense fallback={<div>Loading collaborative session...</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

// Generate a random color for user identification
function getRandomColor() {
  const colors = [
    "#E57373", // Red
    "#F06292", // Pink
    "#BA68C8", // Purple
    "#9575CD", // Deep Purple
    "#7986CB", // Indigo
    "#64B5F6", // Blue
    "#4FC3F7", // Light Blue
    "#4DD0E1", // Cyan
    "#4DB6AC", // Teal
    "#81C784", // Green
    "#AED581", // Light Green
    "#DCE775", // Lime
    "#FFD54F", // Amber
    "#FFB74D", // Orange
    "#FF8A65", // Deep Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}