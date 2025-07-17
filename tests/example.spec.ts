import { test } from '@playwright/test';
import OBSWebSocket from 'obs-websocket-js';

test('Verify OBS connection', async () => {
  // Skip test if OBS is not enabled
  if (process.env.OBS_ENABLED !== 'true') {
    test.skip();
    return;
  }

  const obs = new OBSWebSocket();
  
  try {
    // Connect with proper authentication
    await obs.connect(
      process.env.OBS_WS_URL || 'ws://localhost:4455',
      process.env.OBS_WS_PASSWORD || 'yourpassword',
      {
        rpcVersion: 1,
        eventSubscriptions: 0 // Disable events if not needed
      }
    );

    // Verify connection
    const version = await obs.call('GetVersion');
    console.log('Connected to OBS Version:', version.obsVersion);
    
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  } finally {
    await obs.disconnect();
  }
});