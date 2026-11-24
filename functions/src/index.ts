import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions/v2';
initializeApp();
setGlobalOptions({ region: 'asia-south1', maxInstances: 10 });
// Export feature functions here as they are implemented. No payment processing yet.
