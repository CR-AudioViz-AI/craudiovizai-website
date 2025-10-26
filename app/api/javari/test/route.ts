import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Javari API test route working',
    timestamp: new Date().toISOString()
  });
}
