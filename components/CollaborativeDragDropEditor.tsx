'use client';

import React, { useEffect, useRef, useState } from 'react';
import DragDropEditor from './DragDropEditor';
import { FiRotateCcw, FiRotateCw, FiEye, FiEdit2, FiSave, FiDownload, FiList } from 'react-icons/fi';
import { Button } from './ui/button';
import { useMyPresence, useOthers, useStorage, useMutation, useRoom, useBroadcastEvent, useEventListener, useUndo, useRedo, useCanUndo, useCanRedo } from '@/liveblocks.config';
import { useToast } from '@/app/providers/ToastProvider';

// Component to display other users' cursors
const Cursor = ({ x, y, color, name }: { x: number; y: number; color: string; name: string }) => {
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fill: color,
        }}
      >
        <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.0664062 17.2522V0.375C0.0664062 0.109375 0.237632 0 0.409226 0C0.495414 0 0.581632 0.0273438 0.653132 0.0820312L5.65376 12.3673Z" />
      </svg>

      <div
        className="px-2 py-1 rounded-md text-xs text-white"
        style={{
          backgroundColor: color,
          borderRadius: '4px',
          position: 'absolute',
          top: '20px',
          left: '10px',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
    </div>
  );
};

// Define the interface for UI elements in the editor
interface DroppedComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  styles: any;
  library?: 'shadcn' | 'mui' | 'antd';
}

// Define the metadata structure
interface ComponentMetadata {
  componentType: string;
  styles: any;
  library?: 'shadcn' | 'mui' | 'antd';
}

// Define custom event types
type CustomEvent = 
  | { type: "CANVAS_RESET" }
  | { type: "ELEMENT_UPDATED"; elementId: string }
  | { type: "REACTION"; emoji: string; point: { x: number; y: number } };

// Define a mapping type to convert between Liveblocks UIElement and our DroppedComponent
type LiveblocksUIElement = {
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
  children?: string[];
  // Custom properties for our UI components
  componentType?: string;
  styles?: any;
  library?: 'shadcn' | 'mui' | 'antd';
};

export default function CollaborativeDragDropEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();
  const [localComponents, setLocalComponents] = useState<DroppedComponent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const room = useRoom();
  const broadcast = useBroadcastEvent();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const toast = useToast();
  
  // Use Liveblocks history hooks instead of custom history
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  
  // Access the shared storage
  const elements = useStorage((root) => root.elements);
  
  // Check if storage is loaded
  useEffect(() => {
    if (elements) {
      setIsStorageLoaded(true);
    }
  }, [elements]);
  
  // Create a mutation to update elements
  const updateElement = useMutation(({ storage }, elementId, newPosition: { x: number, y: number }, metadata?: ComponentMetadata) => {
    const elements = storage.get("elements");
    const existingElement = elements.get(elementId);
    
    if (existingElement) {
      // Update position and any metadata in the text field
      elements.set(elementId, {
        ...existingElement,
        x: newPosition.x,
        y: newPosition.y,
        // Store component metadata in the text field as JSON
        text: metadata ? JSON.stringify(metadata) : existingElement.text
      });
    }
  }, []);
  
  // Create a mutation to add a new element
  const addElement = useMutation(({ storage }, component: DroppedComponent) => {
    // Store component data in a format compatible with UIElement
    const element = {
      id: component.id,
      type: "rectangle" as const, // Use rectangle as the base shape
      x: component.position.x,
      y: component.position.y,
      width: 200, // Default width
      height: 50, // Default height
      rotation: 0,
      opacity: 1,
      // Store component metadata in the text field as JSON
      text: JSON.stringify({
        componentType: component.type,
        styles: component.styles,
        library: component.library
      })
    };
    
    const elements = storage.get("elements");
    elements.set(component.id, element);
  }, []);
  
  // Create a mutation to delete an element
  const deleteElement = useMutation(({ storage }, elementId) => {
    const elements = storage.get("elements");
    elements.delete(elementId);
  }, []);
  
  // Create a mutation to reset the canvas
  const resetCanvas = useMutation(({ storage }) => {
    const elements = storage.get("elements");
    
    // Clear all elements - using Array.from to avoid iteration issues
    const keys = Array.from(elements.keys());
    keys.forEach(key => {
      elements.delete(key);
    });
  }, []);

  // Listen for reset events from other clients
  useEventListener(({ event }) => {
    if (event.type === "CANVAS_RESET") {
      // Update local state immediately
      setLocalComponents([]);
    } else if (event.type === "ELEMENT_UPDATED") {
      // Update local state when another user moves an element
      const { elementId, position } = event as { type: "ELEMENT_UPDATED"; elementId: string; position: { x: number; y: number } };
      
      console.log("Received element update event:", elementId, position);
      
      // Only update if we're not currently dragging this element
      if (!isDragging || selectedComponentId !== elementId) {
        setLocalComponents(prevComponents => 
          prevComponents.map(comp => 
            comp.id === elementId 
              ? { ...comp, position } 
              : comp
          )
        );
      }
    }
  });

  // Handle mouse movement to update cursor position
  useEffect(() => {
    if (!containerRef.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      updateMyPresence({
        cursor: { x, y },
      });
    };

    const handlePointerLeave = () => {
      updateMyPresence({
        cursor: null,
      });
    };

    const container = containerRef.current;
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [updateMyPresence]);

  // Convert LiveMap to array for DragDropEditor and update local state
  useEffect(() => {
    if (!elements) return;
    
    console.log("Storage elements updated, isDragging:", isDragging);
    
    // Only update local components if we're not currently dragging
    // This prevents the component from jumping during drag operations
    if (!isDragging) {
      const componentsArray = Array.from(elements.entries()).map(([id, element]) => {
        // Parse metadata from the text field
        let metadata: ComponentMetadata = {
          componentType: "Button",
          styles: {}
        };
        
        try {
          if (element.text) {
            const parsedData = JSON.parse(element.text);
            metadata = {
              componentType: parsedData.componentType || "Button",
              styles: parsedData.styles || {},
              library: parsedData.library || 'shadcn'
            };
          }
        } catch (e) {
          console.error("Failed to parse element metadata", e);
        }
        
        // Convert to DroppedComponent format
        return {
          id,
          type: metadata.componentType,
          position: { 
            x: element.x || 0, 
            y: element.y || 0 
          },
          styles: metadata.styles,
          library: metadata.library,
        } as DroppedComponent;
      });
      
      console.log("Updating local components from storage:", componentsArray);
      setLocalComponents(componentsArray);
    }
  }, [elements, isDragging]);

  // Count the number of other users
  const otherUsersCount = others.length;

  // Custom handlers for DragDropEditor to sync with Liveblocks
  const handleAddComponent = (component: DroppedComponent) => {
    if (!isStorageLoaded) {
      console.warn("Cannot add component: Storage not loaded yet");
      return;
    }
    
    try {
      // Update local state immediately for a responsive UI
      setLocalComponents(prev => [...prev, component]);
      
      // Then update Liveblocks storage
      addElement(component);
    } catch (error) {
      console.error("Error adding component:", error);
    }
  };

  const handleUpdateComponent = (id: string, newData: DroppedComponent) => {
    console.log("Updating component:", id, newData.position);
    
    // Set the currently selected component
    setSelectedComponentId(id);
    
    // Start dragging state to prevent updates from Liveblocks during drag
    setIsDragging(true);
    
    // Update local state immediately for a responsive UI
    setLocalComponents(prevComponents => 
      prevComponents.map(comp => 
        comp.id === id 
          ? { ...comp, position: newData.position } 
          : comp
      )
    );
    
    // Only update in Liveblocks if storage is loaded
    if (isStorageLoaded) {
      try {
        // Extract metadata to store
        const metadata: ComponentMetadata = {
          componentType: newData.type,
          styles: newData.styles,
          library: newData.library
        };
        
        // Update position and metadata in Liveblocks
        updateElement(id, newData.position, metadata);
        
        // Broadcast the movement to other clients for immediate feedback
        broadcast({ 
          type: "ELEMENT_UPDATED", 
          elementId: id
        } as CustomEvent);
      } catch (error) {
        console.error("Error updating component:", error);
      }
    }
    
    // End dragging state after a short delay to ensure smooth movement
    setTimeout(() => {
      setIsDragging(false);
      setSelectedComponentId(null);
    }, 100);
  };

  const handleDeleteComponent = (id: string) => {
    if (!isStorageLoaded) {
      console.warn("Cannot delete component: Storage not loaded yet");
      
      // Fallback: Remove from local state
      setLocalComponents(prev => prev.filter(comp => comp.id !== id));
      return;
    }
    
    try {
      // Update local state immediately
      setLocalComponents(prev => prev.filter(comp => comp.id !== id));
      
      // Then update Liveblocks storage
      deleteElement(id);
    } catch (error) {
      console.error("Error deleting component:", error);
    }
  };
  
  // Handle canvas reset
  const handleResetCanvas = () => {
    if (!isStorageLoaded) {
      console.warn("Cannot reset canvas: Storage not loaded yet");
      
      // Fallback: Clear local state
      setLocalComponents([]);
      return;
    }
    
    try {
      // Update local state immediately
      setLocalComponents([]);
      
      // Reset the canvas in Liveblocks storage
      resetCanvas();
      
      // Broadcast a reset event to all clients
      broadcast({ type: "CANVAS_RESET" });
    } catch (error) {
      console.error("Error resetting canvas:", error);
    }
  };

  // Loading state
  if (!isStorageLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading collaborative editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex-1 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col">
      {/* Desktop toolbar - hidden on mobile */}
      <div className="hidden sm:flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Collaborative Editor</h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={undo}
            disabled={!canUndo || isPreviewMode}
          >
            <FiRotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Undo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={redo}
            disabled={!canRedo || isPreviewMode}
          >
            <FiRotateCw className="h-4 w-4" />
            <span className="hidden sm:inline">Redo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleResetCanvas}
            disabled={isPreviewMode || localComponents.length === 0}
          >
            <FiList className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
              if (!isPreviewMode) {
                setSelectedComponentId(null);
              }
            }}
          >
            {isPreviewMode ? (
              <>
                <FiEdit2 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </>
            ) : (
              <>
                <FiEye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile header - only visible on mobile */}
      <div className="sm:hidden flex flex-col p-2 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Collaborative Editor</h2>
          
          {/* Room info and copy button for mobile */}
          <div className="flex items-center gap-1">
            <span className="text-xs bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded font-mono">{room.id}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const roomLink = `${window.location.origin}/createui?room=${room.id}`;
                navigator.clipboard.writeText(roomLink).then(() => {
                  toast.success('Room link copied to clipboard!');
                });
              }}
              title="Copy room link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Tap and hold components to drag them
        </p>
      </div>

      {/* Render other users' cursors */}
      {others.map(({ presence, connectionId, info }) => {
        if (!presence.cursor) return null;
        return (
          <Cursor
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
            color={presence.color || '#000000'}
            name={info?.name || 'Anonymous'}
          />
        );
      })}

      {/* Render the DragDropEditor with collaborative features */}
      <div className="flex-1 relative">
        <DragDropEditor 
          components={localComponents}
          onAddComponent={handleAddComponent}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          onResetCanvas={handleResetCanvas}
          isCollaborative={true}
        />
      </div>
      
      {/* Display number of connected users */}
      <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full z-10">
        {otherUsersCount + 1} user{otherUsersCount === 0 ? '' : 's'} online
      </div>

      {/* Mobile toolbar - fixed at bottom, only visible on mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center p-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 z-50 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800"
          onClick={undo}
          disabled={!canUndo || isPreviewMode}
          title="Undo"
        >
          <FiRotateCcw className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800"
          onClick={redo}
          disabled={!canRedo || isPreviewMode}
          title="Redo"
        >
          <FiRotateCw className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800 text-red-500"
          onClick={handleResetCanvas}
          disabled={isPreviewMode || localComponents.length === 0}
          title="Reset Canvas"
        >
          <FiList className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800"
          onClick={() => {
            setIsPreviewMode(!isPreviewMode);
            if (!isPreviewMode) {
              setSelectedComponentId(null);
            }
          }}
          title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
        >
          {isPreviewMode ? <FiEdit2 className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Add padding at the bottom to prevent content from being hidden behind the mobile toolbar */}
      <div className="sm:hidden h-16"></div>
    </div>
  );
} 