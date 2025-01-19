import jiraApi from '@/utils/communityApi';
import { NextRequest, NextResponse } from 'next/server';
import { IssueResponse } from 'types/jira';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await jiraApi.get<IssueResponse>(
      `/rest/api/3/issue/${id}`
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.error();
  }
}
