import { ChatPage } from '@/features/ai/ChatPage';
import { useNavigate } from 'react-router-dom';

export default function AiIndex() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return <ChatPage onBack={handleBack} />;
}
