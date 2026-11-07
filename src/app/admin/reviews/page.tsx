'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { useToast } from '@/components/ui/toast';
import { INITIAL_REVIEWS } from '@/lib/mock-data';
import { Review } from '@/types';
import { formatDate } from '@/lib/utils';
import { Check, X, Star, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = React.useState<Review[]>(INITIAL_REVIEWS);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_reviews');
      if (stored) {
        setReviews(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveReviews = (updated: Review[]) => {
    setReviews(updated);
    try {
      localStorage.setItem('mw_trends_reviews', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleApproval = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, is_approved: !r.is_approved } : r));
    saveReviews(updated);
    toast.success('Review approval status toggled.');
  };

  const toggleFeatured = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, is_featured: !r.is_featured } : r));
    saveReviews(updated);
    toast.success('Homepage featured review updated.');
  };

  const handleDelete = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    saveReviews(updated);
    toast.info('Review deleted.');
  };

  return (
    <div className="space-y-6 select-none">
      <div className="border-b border-border pb-5">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
          Social Proof &amp; Feedback
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Customer Reviews Moderation ({reviews.length})
        </h1>
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-2">
                    <Star className="w-8 h-8 text-gold opacity-80" />
                    <p className="font-serif font-bold text-sm text-text-primary">No Customer Reviews Yet</p>
                    <p className="text-xs text-text-muted">
                      When verified buyers submit reviews and ratings on your product pages, they will appear here for approval.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((rev) => (
                <TableRow key={rev.id}>
                  <TableCell>
                    <strong className="text-xs font-semibold text-text-primary block">
                      {rev.author_name}
                    </strong>
                    {rev.is_verified_buyer && (
                      <Badge variant="success" size="sm">
                        Verified Buyer
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Rating value={rev.rating} size="sm" />
                  </TableCell>
                  <TableCell className="max-w-md">
                    {rev.title && <strong className="text-xs text-text-primary block">&quot;{rev.title}&quot;</strong>}
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {rev.comment}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-text-muted">{formatDate(rev.created_at)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rev.is_approved ? 'success' : 'warning'}>
                      {rev.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleFeatured(rev.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        rev.is_featured ? 'text-amber-400 bg-amber-400/10' : 'text-text-muted hover:text-text-primary'
                      }`}
                      title="Toggle featured on homepage"
                    >
                      <Star className={`w-4 h-4 ${rev.is_featured ? 'fill-current' : ''}`} />
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleApproval(rev.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          rev.is_approved ? 'text-text-muted hover:text-amber-500' : 'text-status-success hover:bg-elevated'
                        }`}
                        title={rev.is_approved ? 'Unapprove' : 'Approve'}
                      >
                        {rev.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-status-danger transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
