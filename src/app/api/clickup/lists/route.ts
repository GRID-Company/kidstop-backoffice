/**
 * ClickUp Lists API Route
 * Server-side API endpoint for fetching ClickUp lists
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClickUpService } from '@/features/clickup/domain/services/clickup.service';
import { ClickUpList } from '@/features/clickup/domain/types';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Lists API: Starting request');

    // Check if environment variables are available
    const apiKey = process.env.CLICKUP_API_KEY;
    const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
    const folderId = process.env.CLICKUP_FOLDER_ID;
    
    console.log('🔑 Environment check:', {
      hasApiKey: !!apiKey,
      hasWorkspaceId: !!workspaceId,
      hasFolderId: !!folderId,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '***' : 'none'
    });

    if (!apiKey || !workspaceId) {
      console.log('❌ Missing environment variables');
      return NextResponse.json({
        error: 'ClickUp configuration missing',
        message: 'Please set CLICKUP_API_KEY and CLICKUP_WORKSPACE_ID in environment variables',
        lists: [],
      }, { status: 500 });
    }

    // Initialize ClickUp service
    console.log('🚀 Initializing ClickUp service...');
    const clickUpService = getClickUpService();

    // Get workspace info
    console.log('🏢 Getting workspace info...');
    const workspaceInfo = await clickUpService.getWorkspaceInfo();
    console.log('✅ Workspace info retrieved:', {
      workspaceId: workspaceInfo.workspace.id,
      workspaceName: workspaceInfo.workspace.name,
      spacesCount: workspaceInfo.spaces.length,
      folderId: workspaceInfo.folderId
    });

    // Get lists from the first available folder or configured folder
    let listsToFetch: ClickUpList[] = [];
    
    if (folderId) {
      console.log('📁 Getting lists from configured folder:', folderId);
      try {
        listsToFetch = await clickUpService.listsApi.getLists(folderId);
        console.log('📋 Found lists in folder:', listsToFetch.length);
      } catch (folderError) {
        console.log('❌ Error accessing folder:', folderError);
      }
    }
    
    if (listsToFetch.length === 0 && workspaceInfo.spaces.length > 0) {
      console.log('🌌 Getting folderless lists from first space...');
      try {
        const firstSpace = workspaceInfo.spaces[0];
        listsToFetch = await clickUpService.listsApi.getFolderlessLists(firstSpace.id);
        console.log('📋 Found folderless lists:', listsToFetch.length);
      } catch (spaceError) {
        console.log('❌ Error accessing space:', spaceError);
      }
    }

    console.log('✅ Lists retrieved:', {
      totalLists: listsToFetch.length,
      listNames: listsToFetch.map(list => list.name)
    });

    return NextResponse.json({
      lists: listsToFetch,
      workspace: {
        id: workspaceInfo.workspace.id,
        name: workspaceInfo.workspace.name,
      },
      folderId: workspaceInfo.folderId,
    });

  } catch (error) {
    console.error('❌ Lists API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch lists',
        message: error instanceof Error ? error.message : 'Unknown error',
        lists: [],
      },
      { status: 500 }
    );
  }
}
