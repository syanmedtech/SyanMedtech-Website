
// Mock/Real Firestore Service for Blog SEO
// In a production environment, this would initialize Firebase
export const db = {
  // Simulated storage using localStorage for instant preview, 
  // but architected for seamless Firestore replacement.
  save: async (collection: string, id: string, data: any) => {
    const key = `syan_med_${collection}_${id}`;
    const entry = { ...data, updatedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
    
    // Log for "Revisions" tracking
    if (collection !== 'seo_revisions') {
      const revId = Math.random().toString(36).substr(2, 9);
      const revKey = `syan_med_seo_revisions_${id}`;
      const existing = JSON.parse(localStorage.getItem(revKey) || '[]');
      existing.unshift({ revId, changedAt: Date.now(), data });
      localStorage.setItem(revKey, JSON.stringify(existing.slice(0, 20)));
    }
    return entry;
  },
  get: async (collection: string, id: string) => {
    const key = `syan_med_${collection}_${id}`;
    return JSON.parse(localStorage.getItem(key) || 'null');
  },
  list: async (collection: string) => {
    const items: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`syan_med_${collection}_`)) {
        items.push(JSON.parse(localStorage.getItem(key)!));
      }
    }
    return items;
  }
};
