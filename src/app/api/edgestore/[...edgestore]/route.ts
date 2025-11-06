// app/api/edgestore/[...edgestore]/route.ts
import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
    // define your buckets
    productImages: es.fileBucket({
        maxSize: 4 * 1024 * 1024,  // e.g., 4MB
        accept: ["image/png", "image/jpeg", "image/svg+xml"]
    }),
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;
