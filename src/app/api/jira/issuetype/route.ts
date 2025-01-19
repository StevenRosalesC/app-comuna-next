import jiraApi from '@/utils/communityApi';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('project');
  try {
    const response = await jiraApi.get(
      `/rest/api/3/issuetype/project?projectId=${projectId}`
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.error();
  }
}
