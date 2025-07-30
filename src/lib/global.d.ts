declare global {
    // Allow global mongoose cache for hot reloads
    var mongoose: {
      conn: typeof import('mongoose') | null;
      promise: Promise<typeof import('mongoose')> | null;
    };
  }
  
  // This is needed so the file is treated as a module
  export {};
  