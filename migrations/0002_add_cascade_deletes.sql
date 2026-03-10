-- Add cascade deletes for forum tables to prevent orphaned records

-- forum_replies: cascade when thread is deleted
ALTER TABLE "forum_replies" DROP CONSTRAINT IF EXISTS "forum_replies_thread_id_forum_threads_id_fk";
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_thread_id_forum_threads_id_fk"
  FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- forum_likes: cascade when thread is deleted
ALTER TABLE "forum_likes" DROP CONSTRAINT IF EXISTS "forum_likes_thread_id_forum_threads_id_fk";
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_thread_id_forum_threads_id_fk"
  FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- forum_likes: cascade when reply is deleted
ALTER TABLE "forum_likes" DROP CONSTRAINT IF EXISTS "forum_likes_reply_id_forum_replies_id_fk";
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_reply_id_forum_replies_id_fk"
  FOREIGN KEY ("reply_id") REFERENCES "forum_replies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- forum_threads: cascade when category is deleted
ALTER TABLE "forum_threads" DROP CONSTRAINT IF EXISTS "forum_threads_category_id_forum_categories_id_fk";
ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_category_id_forum_categories_id_fk"
  FOREIGN KEY ("category_id") REFERENCES "forum_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
