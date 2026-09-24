import { auth, getAnonymousUser } from './firebase';

export async function sendCommand(command: any) {
  let token: string | null = null;
  try {
    let user = auth.currentUser;
    if (!user) {
      user = await getAnonymousUser();
    }
    if (user) {
      token = await user.getIdToken().catch(() => null);
    }
  } catch (authErr) {
    console.warn('Auth token acquisition skipped, sending command with guest actor:', authErr);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer guest_token_guest_user_123`;
  }

  const payloadCommand = {
    actorId: 'guest_user_123',
    ...command
  };

  const res = await fetch('/api/commands', {
    method: 'POST',
    headers,
    body: JSON.stringify({ command: payloadCommand })
  });
  
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Server command failed with status ${res.status}`);
  }

  return res.json();
}
