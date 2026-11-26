import { doc, getDocFromServer, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const categories = [
  {
    id: 'home_services',
    name: 'Home Services',
    description: 'Services for home maintenance',
    icon: 'home',
    imageUrl: '',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'agriculture_services',
    name: 'Agriculture Services',
    description: 'Services related to farming and agriculture',
    icon: 'sprout',
    imageUrl: '',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'vehicle_services',
    name: 'Vehicle Services',
    description: 'Vehicle repair and maintenance services',
    icon: 'car',
    imageUrl: '',
    isActive: true,
    sortOrder: 3,
  },
];

export interface CategorySeedResult {
  id: string;
  status: 'created' | 'already-exists';
}

export async function seedServiceCategories(): Promise<CategorySeedResult[]> {
  if (!db) throw new Error('Firestore is not configured.');
  if (!auth?.currentUser) {
    throw Object.assign(new Error('Sign in before initializing service categories.'), { code: 'app/not-authenticated' });
  }
  const database = db;
  const references = categories.map(category => doc(database, 'service_categories', category.id));
  const results = await runTransaction(database, async transaction => {
    const snapshots = await Promise.all(references.map(reference => transaction.get(reference)));
    return categories.map<CategorySeedResult>((category, index) => {
      if (snapshots[index].exists()) return { id: category.id, status: 'already-exists' };
      const { id, ...data } = category;
      transaction.set(references[index], { ...data, createdAt: serverTimestamp() });
      return { id, status: 'created' };
    });
  });

  // A cached read can succeed while the network is disconnected. Verify on server.
  const snapshots = await Promise.all(references.map(reference => getDocFromServer(reference)));
  const missing = snapshots.filter(snapshot => !snapshot.exists()).map(snapshot => snapshot.id);
  if (missing.length) {
    throw Object.assign(new Error(`Firestore verification failed. Missing service categories: ${missing.join(', ')}.`), { code: 'app/category-verification-failed' });
  }
  return results;
}
