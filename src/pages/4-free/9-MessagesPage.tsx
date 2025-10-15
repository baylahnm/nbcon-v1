import { ThreadList } from './others/features/messages/components/ThreadList';

export default function MessagesPage() {
  return (
    <div className="h-screen flex">
      <div className="w-1/3">
        <ThreadList 
          items={[]} 
          onSelect={() => {}} 
          header={<h2>Messages</h2>}
        />
      </div>
      <div className="w-2/3 p-4">
        <p>Select a conversation</p>
      </div>
    </div>
  );
}



