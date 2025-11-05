-- Remove the vulnerable public INSERT policy on blog_posts
-- This policy allowed anyone (authenticated or not) to create blog posts
-- The existing "Admins can manage blog posts" policy already covers INSERT for admins
DROP POLICY IF EXISTS "Allow insert for all users" ON public.blog_posts;