import { Clock, Lock } from 'lucide-react';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  onClick: () => void;
}

export const NoteCard = ({ title, content, isPrivate, createdAt, onClick }: NoteCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPreview = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  return (
    <div
      onClick={onClick}
      className="group backdrop-blur-xl bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-lg line-clamp-2 flex-1">
          {title || 'Untitled Note'}
        </h3>
        {isPrivate && (
          <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 ml-2" />
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
        {getPreview(content) || 'No content'}
      </p>

      <div className="flex items-center text-gray-500 text-xs">
        <Clock className="w-4 h-4 mr-1" />
        <span>{formatDate(createdAt)}</span>
      </div>
    </div>
  );
};
