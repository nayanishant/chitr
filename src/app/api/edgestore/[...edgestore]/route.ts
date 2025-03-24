import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

/**
 * EdgeStore Router for File Uploads
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * Type-safe Client for Frontend
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
