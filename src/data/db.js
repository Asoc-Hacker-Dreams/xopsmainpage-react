import Dexie from 'dexie';

// Initialize IndexedDB database
class XOpsDatabase extends Dexie {
  constructor() {
    super('XOpsDatabase');
    
    // Define database schema
    this.version(1).stores({
      talks: '++id, slug, speaker, timeISO, track, type, room', // indexed fields
      speakers: '++id, slug, name', // indexed fields
      metadata: 'key' // for storing last sync time, etc.
    });
    
    // Table references
    this.talks = this.table('talks');
    this.speakers = this.table('speakers');
    this.metadata = this.table('metadata');
  }
}

// Create singleton instance
const db = new XOpsDatabase();

export default db;
