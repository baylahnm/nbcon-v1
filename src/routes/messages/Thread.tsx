import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MessagesIndex from "./Index";

export default function MessagesThread() {
  const { threadId } = useParams();
  // Reuse the same layout; store.openThread will run from Index when threads load
  useEffect(()=>{ /* could pre-open threadId via store if needed */ }, [threadId]);
  return <MessagesIndex />;
}

