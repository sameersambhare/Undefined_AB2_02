import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/jwt';

// GET - Retrieve a specific layout by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { layoutId: string } }
) {
  try {
    const layoutId = params.layoutId;
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Find the user
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find the layout in the user's saved layouts
    const layoutIndex = user.savedLayouts.findIndex(
      (layout) => layout._id.toString() === layoutId
    );
    
    if (layoutIndex === -1) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      );
    }
    
    // Return the layout
    return NextResponse.json({
      success: true,
      layout: user.savedLayouts[layoutIndex]
    });
  } catch (error: any) {
    console.error('Get layout error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific layout by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { layoutId: string } }
) {
  try {
    const layoutId = params.layoutId;
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const layoutData = await req.json();
    
    // Validate input
    if (!layoutData.name || !layoutData.components) {
      return NextResponse.json(
        { error: 'Layout name and components are required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Find the user
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find the layout index in the user's saved layouts
    const layoutIndex = user.savedLayouts.findIndex(
      (layout) => layout._id.toString() === layoutId
    );
    
    if (layoutIndex === -1) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      );
    }
    
    // Update the layout
    user.savedLayouts[layoutIndex] = {
      ...user.savedLayouts[layoutIndex],
      name: layoutData.name,
      description: layoutData.description || user.savedLayouts[layoutIndex].description,
      components: layoutData.components,
      thumbnail: layoutData.thumbnail || user.savedLayouts[layoutIndex].thumbnail,
      updatedAt: new Date()
    };
    
    // Save the user
    await user.save();
    
    // Return success response
    return NextResponse.json({
      success: true,
      layout: user.savedLayouts[layoutIndex]
    });
  } catch (error: any) {
    console.error('Update layout error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific layout by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { layoutId: string } }
) {
  try {
    const layoutId = params.layoutId;
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Find the user
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find the layout index in the user's saved layouts
    const layoutIndex = user.savedLayouts.findIndex(
      (layout) => layout._id.toString() === layoutId
    );
    
    if (layoutIndex === -1) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      );
    }
    
    // Remove the layout
    user.savedLayouts.splice(layoutIndex, 1);
    
    // Save the user
    await user.save();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Layout deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete layout error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 