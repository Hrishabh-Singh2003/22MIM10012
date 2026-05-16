import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '10';
  const page = searchParams.get('page') || '1';
  const notification_type = searchParams.get('notification_type') || '';

  const externalUrl = new URL('http://4.224.186.213/evaluation-service/notifications');
  externalUrl.searchParams.append('limit', limit);
  externalUrl.searchParams.append('page', page);
  if (notification_type) {
    externalUrl.searchParams.append('notification_type', notification_type);
  }

  const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoYWJoc2luZ2gyMDIyQHZpdGJob3BhbC5hYy5pbiIsImV4cCI6MTc3ODkzMTYxNCwiaWF0IjoxNzc4OTMwNzE0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZThiOTRkMWUtMjc3Ny00YTEzLTkyMDYtZmQ0NmNlM2NjNjZiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicmlzaGFiaCBzaW5naCIsInN1YiI6IjFiYjhjNjViLWE1MzAtNDNhYi04Yjg0LWRkNmMzYWNiNzYxNSJ9LCJlbWFpbCI6InJpc2hhYmhzaW5naDIwMjJAdml0YmhvcGFsLmFjLmluIiwibmFtZSI6InJpc2hhYmggc2luZ2giLCJyb2xsTm8iOiIyMm1pbTEwMDEyIiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMWJiOGM2NWItYTUzMC00M2FiLThiODQtZGQ2YzNhY2I3NjE1IiwiY2xpZW50U2VjcmV0IjoiRkJiaFVYa1BUR2RWUlB3UiJ9.17qZW7RDlbSsavnm-myJpiIWx32Q3hFyc8XMoiQyeIU';

  try {
    const response = await fetch(externalUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from external API' }, { status: 500 });
  }
}
