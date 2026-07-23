-- Security fix: both policies below were left with `WITH CHECK (true)`, which lets
-- ANY anonymous or authenticated caller (using only the public anon key) insert rows
-- directly via PostgREST, completely bypassing the edge functions that are supposed
-- to be the only entry point (and their validation, reCAPTCHA, honeypot, and rate limiting).

-- consultations: anyone could insert arbitrary booking rows (any email/name/date/status),
-- bypassing book-consultation's Zod validation, reCAPTCHA check, honeypot, and 5/day rate
-- limit. All legitimate bookings already go through the book-consultation edge function,
-- which uses the service-role key and therefore bypasses RLS entirely — so no anon/
-- authenticated INSERT policy is actually needed for the app to keep working.
DROP POLICY IF EXISTS "Users can create consultations" ON public.consultations;

-- blog_posts: anyone could insert a row with published = true, publishing arbitrary
-- content straight to the live public blog with no admin check at all. Admin writes
-- (BlogPostEditor, generate-blog-post) already succeed under the separate
-- "Admins can manage blog posts" FOR ALL policy, so this permissive policy was
-- redundant for legitimate use and only served as an open write hole.
DROP POLICY IF EXISTS "Allow insert for all users" ON public.blog_posts;
