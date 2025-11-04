// app/api/security/honeypot/route.ts
// Honeypot trap for attackers

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  console.log(`🍯 [HONEYPOT] Triggered by ${ip}`);
  
  // Return a fake "loading" admin panel
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>System Administration - Authenticating...</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          color: white;
        }
        .container {
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        .loader {
          border: 6px solid rgba(255,255,255,0.3);
          border-top: 6px solid #fff;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        h2 { margin: 0 0 10px; font-weight: 300; }
        p { margin: 5px 0; opacity: 0.8; font-size: 14px; }
        .progress {
          width: 200px;
          height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          margin: 20px auto;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: white;
          width: 0%;
          animation: progress 30s linear infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="loader"></div>
        <h2>Verifying Credentials</h2>
        <p>Please wait while we authenticate your session...</p>
        <div class="progress"><div class="progress-bar"></div></div>
        <p style="font-size: 12px; margin-top: 20px;">Session ID: ${crypto.randomUUID()}</p>
      </div>
      <script>
        // Keep them busy for a while
        let dots = 0;
        setInterval(() => {
          dots = (dots + 1) % 4;
          document.querySelector('p').textContent = 'Authenticating' + '.'.repeat(dots);
        }, 500);
        
        // After 30 seconds, show fake error
        setTimeout(() => {
          document.body.innerHTML = \`
            <div class="container">
              <h2 style="color: #ff6b6b;">Session Expired</h2>
              <p>Your session has timed out. Please refresh the page to try again.</p>
              <p style="margin-top: 20px;"><small>Error Code: SEC-${Date.now()}</small></p>
            </div>
          \`;
        }, 30000);
      </script>
    </body>
    </html>
  `, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const body = await request.json().catch(() => ({}));
  
  console.log(`🍯 [HONEYPOT] Login attempt from ${ip}`, body);
  
  // Fake "processing" delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return NextResponse.json({
    success: false,
    error: 'Invalid credentials',
    message: 'The username or password you entered is incorrect.',
    attempts_remaining: Math.floor(Math.random() * 3) + 1,
  }, { status: 401 });
}
