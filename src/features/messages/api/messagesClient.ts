export const messagesClient = {
  createThread: async (_args:any) => ({ id:"" }),
  send: async (_args:any) => ({ ok:true }),
  markRead: async (_args:any) => ({ ok:true }),
  search: async (_args:any) => ({ items:[], next:false }),
  translate: async (_args:any) => ({ translated_text:"", translated_from:"en" }),
  transcribe: async (_args:any) => ({ text:"", lang:"en", confidence:0.9 }),
  secureFileUrl: async (_args:any) => ({ url:"#", ttl:60 }),
};

