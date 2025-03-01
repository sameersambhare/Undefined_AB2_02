import { createClient, LiveMap } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Real-time cursor coordinates
      cursor: { x: number; y: number } | null;
      // User's selection state
      selection: string[] | null;
      // User's current active tool
      currentTool: string | null;
      // User's color
      color: string;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // UI elements in the canvas
      elements: LiveMap<string, UIElement>;
      // Canvas settings
      canvasSettings: {
        width: number;
        height: number;
        background: string;
      };
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        email?: string;
        avatar?: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: 
      | { type: "ELEMENT_UPDATED"; elementId: string }
      | { type: "CANVAS_RESET" }
      | { type: "REACTION"; emoji: string; point: { x: number; y: number } };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Coordinates for thread placement on the canvas
      x: number;
      y: number;
      // Element ID if thread is attached to an element
      elementId?: string;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Project title
      title: string;
      // Last modified timestamp
      lastModified: number;
      // Project owner
      ownerId: string;
    };
  }
}

// UI Element type for the canvas
type UIElement = {
  id: string;
  type: "rectangle" | "circle" | "text" | "image" | "group";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  imageUrl?: string;
  children?: string[]; // For group elements
};

// Create the Liveblocks client
const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

// Create the room context
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useErrorListener,
  useStorage,
  useBatch,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStatus,
  useLostConnectionListener,
  useThreads,
  useUser,
  useCreateThread,
  useEditThreadMetadata,
  useCreateComment,
  useEditComment,
  useDeleteComment,
  useAddReaction,
  useRemoveReaction,
  useThreadSubscription,
  useMarkThreadAsRead,
  useRoomInfo,
  useDeleteThread,
} = createRoomContext(client);

export { client };
