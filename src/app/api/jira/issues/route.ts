import jiraApi from '@/utils/communityApi';
import { NextRequest, NextResponse } from 'next/server';
import { IssueCreationBody } from 'types/jira';

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('project');
  const response = await jiraApi.get(
    `/rest/api/3/search?jql=project=${projectId}`
  );
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const { title, description, issueType } = await request.json();
  const projectID = request.nextUrl.searchParams.get('project');
  try {
    const body: IssueCreationBody = {
      fields: {
        description: {
          content: [
            {
              content: [
                {
                  text: description,
                  type: 'text'
                }
              ],
              type: 'paragraph'
            }
          ],
          type: 'doc',
          version: 1
        },
        issuetype: {
          id: issueType
        },
        project: {
          id: projectID as string
        },
        summary: title,
        labels: ['bugfix', 'blitz_test']
      },
      update: {}
    };

    const response = await jiraApi.post('/rest/api/3/issue', body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
