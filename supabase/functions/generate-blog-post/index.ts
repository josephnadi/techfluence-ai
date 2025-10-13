import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, category } = await req.json();
    
    if (!topic || !category) {
      return new Response(
        JSON.stringify({ error: 'Topic and category are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating blog post for topic: ${topic}, category: ${category}`);

    // Call Lovable AI to generate blog post
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert tech writer specializing in AI, digital transformation, and IT consulting. Generate comprehensive, SEO-optimized blog posts that drive traffic and engagement. Include:
- Engaging title (under 60 characters)
- Compelling excerpt (under 160 characters)
- Full article content in markdown format (1000-1500 words)
- 5-7 relevant SEO keywords
- Estimated read time

Focus on practical insights, real-world examples, and actionable advice for African businesses and tech professionals.`
          },
          {
            role: 'user',
            content: `Create a detailed blog post about: ${topic}
Category: ${category}

Return the response in JSON format with these exact fields:
{
  "title": "SEO-optimized title under 60 characters",
  "excerpt": "Compelling excerpt under 160 characters",
  "content": "Full markdown content (1000-1500 words)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "readTime": "X min read"
}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices?.[0]?.message?.content;
    
    if (!generatedContent) {
      throw new Error('No content generated from AI');
    }

    console.log('AI generated content:', generatedContent);

    // Parse the AI response
    let blogData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = generatedContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                       generatedContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : generatedContent;
      blogData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI generated content');
    }

    // Generate slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert blog post into database
    const { data: insertedPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title: blogData.title,
        slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category,
        keywords: blogData.keywords || [],
        read_time: blogData.readTime || '5 min read',
        published: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to save blog post: ${insertError.message}`);
    }

    console.log('Blog post created successfully:', insertedPost.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: insertedPost,
        message: 'Blog post generated and published successfully!' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blog-post function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
