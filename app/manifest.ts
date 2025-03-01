import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SnapUI - AI-Powered UI Design Tool',
    short_name: 'SnapUI',
    description: 'Create beautiful user interfaces with SnapUI, an AI-powered design tool',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    orientation: 'portrait',
    categories: ['design', 'productivity', 'development'],
    screenshots: [
      {
        src: '/screenshots/desktop-1.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        platform: 'wide',
        label: 'SnapUI Dashboard',
      },
      {
        src: '/screenshots/desktop-2.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        platform: 'wide',
        label: 'SnapUI Editor',
      },
      {
        src: '/screenshots/mobile-1.jpg',
        sizes: '750x1334',
        type: 'image/jpeg',
        platform: 'narrow',
        label: 'SnapUI Mobile Dashboard',
      },
    ],
    shortcuts: [
      {
        name: 'Create New UI',
        short_name: 'Create UI',
        description: 'Start designing a new UI',
        url: '/createui',
        icons: [{ src: '/icons/create-icon.png', sizes: '96x96' }],
      },
      {
        name: 'My Layouts',
        short_name: 'Layouts',
        description: 'View your saved layouts',
        url: '/layouts',
        icons: [{ src: '/icons/layouts-icon.png', sizes: '96x96' }],
      },
    ],
  };
} 