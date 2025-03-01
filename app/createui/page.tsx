'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ComponentList from '@/components/ComponentList';
import DragDropEditor from '@/components/DragDropEditor';
import CollaborativeDragDropEditor from '@/components/CollaborativeDragDropEditor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import Cookies from 'js-cookie';
import Room from '../Room';
import { nanoid } from 'nanoid';

type UILibrary = 'shadcn' | 'mui' | 'antd';

interface DroppedComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  styles: any;
  library?: UILibrary;
}

const CreateUIPage = () => {
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomComponents, setRoomComponents] = useState<DroppedComponent[]>([]);
  
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const handleComponentDragStart = (e: React.DragEvent<HTMLDivElement>, component: string, styles: any, library: UILibrary) => {
    e.dataTransfer.setData('componentType', component);
    e.dataTransfer.setData('componentStyles', JSON.stringify(styles || {}));
    e.dataTransfer.setData('componentLibrary', library);
    setDraggedComponent({ type: component, styles });
  };

  const handleCreateRoom = () => {
    const newRoomId = nanoid(10); // Generate a random room ID
    setRoomId(newRoomId);
    setIsInRoom(true);
    
    // Save room ID to cookies for persistence
    Cookies.set('roomId', newRoomId, { expires: 1 }); // Expires in 1 day
    
    // Copy room link to clipboard
    const roomLink = `${window.location.origin}/createui?room=${newRoomId}`;
    navigator.clipboard.writeText(roomLink).then(() => {
      toast.success('Room link copied to clipboard! Share it with your collaborators.');
    });
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    setIsInRoom(true);
    setIsJoiningRoom(false);
    
    // Save room ID to cookies for persistence
    Cookies.set('roomId', id, { expires: 1 }); // Expires in 1 day
  };

  const handleLeaveRoom = () => {
    setIsInRoom(false);
    setRoomId('');
    setRoomComponents([]);
    
    // Remove room ID from cookies
    Cookies.remove('roomId');
  };

  // Check for room ID in URL parameters or cookies on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    
    if (roomParam) {
      handleJoinRoom(roomParam);
    } else {
      // Check if user was in a room previously
      const savedRoomId = Cookies.get('roomId');
      if (savedRoomId) {
        handleJoinRoom(savedRoomId);
      }
    }
  }, []);

  const handleAddComponent = (component: DroppedComponent) => {
    setRoomComponents(prev => [...prev, component]);
  };

  const handleUpdateComponent = (id: string, updatedComponent: DroppedComponent) => {
    setRoomComponents(prev => 
      prev.map(comp => comp.id === id ? updatedComponent : comp)
    );
  };

  const handleDeleteComponent = (id: string) => {
    setRoomComponents(prev => prev.filter(comp => comp.id !== id));
  };

  const handleResetCanvas = () => {
    setRoomComponents([]);
  };

  // Render inside Room component
  const renderCollaborativeMode = () => (
    <CollaborativeDragDropEditor />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Collaborative Room Controls */}
        {!isInRoom && (
          <div className="fixed top-16 left-0 right-0 p-2 bg-white dark:bg-zinc-900 z-20 shadow-md flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={handleCreateRoom}
              className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M20 8h-9a2 2 0 0 0-2 2v9"/>
                <path d="M13 17H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h9a2 2 0 0 1 2 2v1"/>
                <path d="M21.4 20H17l-1.8-8H20l2 8Z"/>
                <path d="M12 12h8"/>
                <path d="m15 9 3 3-3 3"/>
              </svg>
              Create Room
            </button>
            <button
              onClick={() => setIsJoiningRoom(true)}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Join Room
            </button>
            
            {isJoiningRoom && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Join Room</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room ID</label>
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Enter room ID"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-zinc-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsJoiningRoom(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleJoinRoom(roomId)}
                      disabled={!roomId.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Room UI */}
        {isInRoom && (
          <div className="fixed top-16 left-0 right-0 p-2 bg-white dark:bg-zinc-900 z-20 shadow-md flex flex-wrap gap-2 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm dark:text-white">Room: </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 rounded text-xs font-mono dark:text-gray-300">{roomId}</span>
              <button
                onClick={() => {
                  const roomLink = `${window.location.origin}/createui?room=${roomId}`;
                  navigator.clipboard.writeText(roomLink).then(() => {
                    toast.success('Room link copied to clipboard!');
                  });
                }}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Copy room link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm ml-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Leave Room
            </button>
          </div>
        )}
        
        {/* Component sidebar and editor - wrapped in a container to handle the top bar offset */}
        <div className={`flex flex-1 flex-col md:flex-row ${isInRoom ? 'mt-12' : 'mt-12'}`}>
          <ComponentList onDragStart={handleComponentDragStart} />
          
          {isInRoom ? (
            <Room roomId={roomId}>
              {renderCollaborativeMode()}
            </Room>
          ) : (
            <DragDropEditor />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateUIPage;
