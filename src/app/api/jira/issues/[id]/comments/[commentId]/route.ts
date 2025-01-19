import jiraApi from '@/utils/communityApi';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  const { id: issueId, commentId } = params;

  try {
    const response = (await jiraApi.delete(
      `/rest/api/3/issue/${issueId}/comment/${commentId}`
    )) as { status: number };

    if (response.status === 204) {
      return NextResponse.json({ success: true, issueId, commentId });
    }

    return NextResponse.json({
      success: false,
      message: 'Unexpected response status',
      status: response.status
    });
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message || error.message || 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting comment',
        details: errorMessage
      },
      { status: statusCode } // Usa un código de estado HTTP válido
    );
  }
}

// get Method for testing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  const { id: issueId, commentId } = params;
  return NextResponse.json({ issueId, commentId });
}
