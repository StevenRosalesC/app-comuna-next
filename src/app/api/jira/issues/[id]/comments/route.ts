import jiraApi from '@/utils/communityApi';
import { NextRequest, NextResponse } from 'next/server';
import { CommentCreationResponse } from 'types/jira';

interface RequestBody {
  comment: string;
}
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { comment } = (await request.json()) as RequestBody;
  try {
    const response = await jiraApi.post<CommentCreationResponse>(
      `/rest/api/3/issue/${params.id}/comment`,
      {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment
                }
              ]
            }
          ]
        }
      }
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.error();
  }
}

// get Method for testing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  return NextResponse.json({ id });
}
