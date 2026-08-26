"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

// In-memory storage for development (fallback when Supabase not configured)
const inMemoryPosts: any[] = [];

export async function uploadSocialImage(file: File, username: string, caption: string) {
    try {
        const supabase = createSupabaseServerClient();
        
        // Try Supabase first, fallback to in-memory
        if (supabase) {
            console.log('Using Supabase storage');
            
            try {
                // Generate unique filename
                const fileExt = file.name.split('.').pop();
                const fileName = `${username}-${Date.now()}.${fileExt}`;
                
                // Upload to Supabase storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('social-images')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Supabase upload error, falling back:', uploadError);
                    throw new Error('Supabase upload failed');
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('social-images')
                    .getPublicUrl(fileName);

                // Create social post in database
                const { data: postData, error: postError } = await supabase
                    .from('social_posts')
                    .insert({
                        username: username,
                        image_url: publicUrl,
                        caption: caption,
                        likes: 0,
                        products: []
                    })
                    .select()
                    .single();

                if (postError) {
                    console.error('Post creation error, falling back:', postError);
                    // Clean up uploaded image if post creation fails
                    await supabase.storage.from('social-images').remove([fileName]);
                    throw new Error('Post creation failed');
                }

                return {
                    success: true,
                    post: postData,
                    imageUrl: publicUrl
                };
                
            } catch (supabaseError) {
                console.log('Supabase failed, using in-memory fallback');
                // Fall through to in-memory storage
            }
        }
        
        // In-memory storage fallback
        console.log('Using in-memory storage');
        
        // Convert file to base64 for storage
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        // Create post in memory
        const newPost = {
            id: `memory-${Date.now()}`,
            username: username,
            image_url: dataUrl,
            caption: caption,
            likes: 0,
            products: [],
            created_at: new Date().toISOString()
        };
        
        // Add to beginning of in-memory storage
        inMemoryPosts.unshift(newPost);
        
        return {
            success: true,
            post: newPost,
            imageUrl: dataUrl
        };
        
    } catch (error) {
        console.error('Upload completely failed:', error);
        throw new Error('Failed to upload image');
    }
}

export async function getSocialPosts() {
    const supabase = createSupabaseServerClient();
    
    // Fallback to in-memory storage if Supabase not available
    if (!supabase) {
        console.log('Supabase not available, using in-memory storage');
        return inMemoryPosts;
    }
    
    try {
        const { data, error } = await supabase
            .from('social_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching posts:', error);
            // Fallback to in-memory on error
            return inMemoryPosts;
        }

        return data || [];

    } catch (error) {
        console.error('Get posts error:', error);
        // Fallback to in-memory on error
        return inMemoryPosts;
    }
}

export async function likePost(postId: string) {
    const supabase = createSupabaseServerClient();
    
    // Fallback to in-memory storage if Supabase not available
    if (!supabase) {
        console.log('Supabase not available, using in-memory storage');
        
        const post = inMemoryPosts.find(p => p.id === postId);
        if (post) {
            post.likes += 1;
            return post;
        }
        throw new Error('Post not found');
    }
    
    try {
        const { data, error } = await supabase
            .from('social_posts')
            .update({ likes: (await supabase.from('social_posts').select('likes').eq('id', postId).single()).data?.likes || 0 + 1 })
            .eq('id', postId)
            .select()
            .single();

        if (error) {
            console.error('Like post error:', error);
            throw new Error('Failed to like post');
        }

        return data;

    } catch (error) {
        console.error('Like post error:', error);
        throw error;
    }
}
