// In-memory storage for blog posts
let blogPosts = [];

// Create a new blog post
export const createBlogPost = async (data) => {
    try {
        const { slug } = data;

        // Check if a blog post with the same slug already exists
        const existingBlogPost = blogPosts.find(post => post.slug === slug);
        if (existingBlogPost) {
            return { error: 'Slug already exists' };
        }

        blogPosts.push(data);
        return data;
    } catch (error) {
        return { error: error.message };
    }
};

// Get all blog posts
export const getAllBlogPosts = async (condition = {}) => {
    try {
        // Filter blog posts based on condition
        const filteredPosts = blogPosts.filter(post => {
            return Object.keys(condition).every(key => post[key] === condition[key]);
        });
        return filteredPosts;
    } catch (error) {
        return { error: error.message };
    }
};

// Get a single blog post by ID
export const getBlogPostById = async (id) => {
    try {
        const blogPost = blogPosts.find(post => post.id === id);
        if (!blogPost) {
            return { error: 'Blog post not found' };
        }
        return blogPost;
    } catch (error) {
        return { error: error.message };
    }
};

// Get a single blog post by condition
export const getSingleBlogPostByCondition = async (condition = {}) => {
    try {
        const blogPost = blogPosts.find(post => {
            return Object.keys(condition).every(key => post[key] === condition[key]);
        });
        if (!blogPost) {
            return { status: false, error: 'Blog post not found' };
        }
        return { status: true, blogPost: blogPost };
    } catch (error) {
        console.error('Error fetching blog posts by condition:', error);
        throw { status: false, error: error.message };
    }
};

// Update a blog post by ID
export const updateBlogPostById = async (id, data) => {
    try {
        const index = blogPosts.findIndex(post => post.id === id);
        if (index === -1) {
            return { error: 'Blog post not found' };
        }
        blogPosts[index] = { ...blogPosts[index], ...data };
        return blogPosts[index];
    } catch (error) {
        return { error: error.message };
    }
};

// Delete a blog post by ID
export const deleteBlogPostById = async (id) => {
    try {
        const index = blogPosts.findIndex(post => post.id === id);
        if (index === -1) {
            return { error: 'Blog post not found' };
        }
        blogPosts.splice(index, 1);
        return { message: 'Blog post deleted successfully' };
    } catch (error) {
        return { error: error.message };
    }
};

// Update status for all blog posts
export const updateStatusForAllBlogPosts = async () => {
    try {
        blogPosts = blogPosts.map(post => {
            if (post.category.slug !== 'bat-dong-san') {
                return { ...post, deleted: true };
            }
            return post;
        });
        console.log('Updated documents:', blogPosts);
        return blogPosts;
    } catch (error) {
        console.error('Error updating status for all blog posts:', error);
        throw error;
    }
};