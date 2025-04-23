import React, { useState } from 'react';

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface Review {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  comments: Comment[];
}

interface ReviewProps {
  reviews: Review[];
}

const Review: React.FC<ReviewProps> = ({ reviews: initialReviews }) => {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleReviewClick = (reviewId: string) => {
    setSelectedReviewId(selectedReviewId === reviewId ? null : reviewId);
    setNewComment(''); // เคลียร์ค่า comment เมื่อเปลี่ยน review
  };

  const selectedReview = reviews.find(review => review.id === selectedReviewId);

  const handleAddReview = async () => {
    if (!newReview.trim()) return;

    setIsSubmittingReview(true);
    try {
      // TODO: ในอนาคตจะส่ง API request ไปที่ backend
      const newReviewObj: Review = {
        id: (reviews.length + 1).toString(),
        content: newReview,
        author: 'ผู้ใช้ปัจจุบัน', // TODO: ใช้ชื่อจริงของผู้ใช้
        createdAt: new Date(),
        comments: []
      };

      setReviews([...reviews, newReviewObj]);
      setNewReview('');
    } catch (error) {
      console.error('Error adding review:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedReviewId || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      // TODO: ในอนาคตจะส่ง API request ไปที่ backend
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: 'ผู้ใช้ปัจจุบัน', // TODO: ใช้ชื่อจริงของผู้ใช้
        createdAt: new Date()
      };

      const updatedReviews = reviews.map(review =>
        review.id === selectedReviewId
          ? { ...review, comments: [...review.comments, newCommentObj] }
          : review
      );

      setReviews(updatedReviews);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // เพิ่มฟังก์ชันสำหรับจัดรูปแบบวันที่และเวลา
  const formatDateTime = (date: Date) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    const thaiDate = date.toLocaleDateString('th-TH', dateOptions);
    const thaiTime = date.toLocaleTimeString('th-TH', timeOptions);
    
    return `${thaiDate} ${thaiTime} น.`;
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Reviews Column */}
      <div className="bg-[#24283b] rounded-lg flex flex-col h-[900px]">
        <div className="p-6">
          <h2 className="text-2xl font-medium text-[#7c5cff]">Reviews</h2>
        </div>
        
        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <div className="space-y-4 pr-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer
                  ${selectedReviewId === review.id 
                    ? 'bg-[#2a2e44] border-[#7c5cff]' 
                    : 'bg-[#1a1b26] border-[#1e2030] hover:border-[#7c5cff]/50'}`}
                onClick={() => handleReviewClick(review.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-[#a9b1d6]">{review.author}</span>
                  <span className="text-sm text-gray-400">
                    {formatDateTime(review.createdAt)}
                  </span>
                </div>
                <p className="text-[#a9b1d6] line-clamp-3">{review.content}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {review.comments.length} ความคิดเห็น
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#1e2030] mx-6" />

        {/* Add Review Section */}
        <div className="p-6 rounded-b-lg">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="เขียน Review ของคุณที่นี่..."
            className="w-full h-32 p-3 bg-[#1e1e1e] text-white rounded-lg border border-[#1e2030] focus:border-[#7c5cff] focus:outline-none resize-none mb-4"
          />
          <button
            onClick={handleAddReview}
            disabled={isSubmittingReview || !newReview.trim()}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors
              ${isSubmittingReview || !newReview.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#7c5cff] hover:bg-[#6f51e6]'}`}
          >
            {isSubmittingReview ? 'กำลังส่ง...' : 'เพิ่ม Review'}
          </button>
        </div>
      </div>

      {/* Comments Column */}
      <div className="bg-[#24283b] rounded-lg flex flex-col h-[900px]">
        <div className="p-6">
          <h2 className="text-2xl font-medium text-[#7c5cff]">
            {selectedReview 
              ? `ความคิดเห็นสำหรับ Review ของ ${selectedReview.author}`
              : 'กรุณาเลือก Review เพื่อดูความคิดเห็น'}
          </h2>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <div className="space-y-4 pr-2">
            {selectedReview ? (
              selectedReview.comments.length > 0 ? (
                selectedReview.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-[#1a1b26] rounded-lg border border-[#1e2030]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-[#a9b1d6]">{comment.author}</span>
                      <span className="text-sm text-gray-400">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-[#a9b1d6]">{comment.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  ยังไม่มีความคิดเห็นสำหรับ Review นี้
                </div>
              )
            ) : (
              <div className="text-center text-gray-400 py-8">
                เลือก Review ทางด้านซ้ายเพื่อดูความคิดเห็น
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#1e2030] mx-6" />

        {/* Add Comment Section */}
        <div className="p-6 rounded-b-lg">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={selectedReview ? "เขียนความคิดเห็นของคุณที่นี่..." : "กรุณาเลือก Review ก่อนเขียนความคิดเห็น"}
            disabled={!selectedReview}
            className={`w-full h-32 p-3 bg-[#1e1e1e] text-white rounded-lg border border-[#1e2030] focus:border-[#7c5cff] focus:outline-none resize-none mb-4
              ${!selectedReview && 'opacity-50 cursor-not-allowed'}`}
          />
          <button
            onClick={handleAddComment}
            disabled={isSubmittingComment || !newComment.trim() || !selectedReview}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors
              ${isSubmittingComment || !newComment.trim() || !selectedReview
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#7c5cff] hover:bg-[#6f51e6]'}`}
          >
            {isSubmittingComment ? 'กำลังส่ง...' : 'เพิ่มความคิดเห็น'}
          </button>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(124, 92, 255, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(124, 92, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Review; 