import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

interface ActionCommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionLabel: string;
  actionDescription?: string;
  variant?: "default" | "destructive" | "warning";
  onSubmit: (comment: string) => void;
}

const MIN_COMMENT_LENGTH = 10;

export function ActionCommentModal({
  open,
  onOpenChange,
  actionLabel,
  actionDescription,
  variant = "default",
  onSubmit,
}: ActionCommentModalProps) {
  const [comment, setComment] = useState("");
  const isValid = comment.trim().length >= MIN_COMMENT_LENGTH;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(comment.trim());
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {variant !== "default" && (
              <AlertTriangle className="h-5 w-5 text-warning" />
            )}
            {actionLabel}
          </DialogTitle>
          {actionDescription && (
            <DialogDescription>{actionDescription}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <Textarea
              placeholder="Enter a mandatory comment for the audit trail (min 10 characters)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-muted-foreground">
                {comment.trim().length < MIN_COMMENT_LENGTH ? (
                  <span className="text-destructive">
                    {MIN_COMMENT_LENGTH - comment.trim().length} more characters required
                  </span>
                ) : (
                  <span className="text-success">✓ Comment meets minimum length</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {comment.length}/1000
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Confirm {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
