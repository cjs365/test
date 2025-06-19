'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { useTheme } from '@/app/context/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { methodologyApi, Article, ArticleListItem } from '@/api/v1/methodology/service';
import { Trash, Edit, Plus, Save, X, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

// Dynamically import the editor to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Interface for table of contents
interface TableOfContentsItem {
  level: number;
  text: string;
  id: string;
}

// Interface for grouped articles
interface ArticleSection {
  id: string;
  title: string;
  articles: {
    id: string | number;
    title: string;
    excerpt?: string;
  }[];
}

// Interface for selected article
interface SelectedArticle {
  title: string;
  articleId: string | number;
}

// Function to extract table of contents from markdown content
const extractTableOfContents = (content: string): TableOfContentsItem[] => {
  const headings: TableOfContentsItem[] = [];
  const h2Regex = /^## (.*$)/gm;
  const h3Regex = /^### (.*$)/gm;
  const h4Regex = /^#### (.*$)/gm;
  
  // Helper function to clean markdown for ID generation
  const cleanMarkdownForId = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers
      .replace(/`(.*?)`/g, '$1')       // Remove code markers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove link markers
      .replace(/[^\w\s-]/g, '')        // Remove special characters
      .toLowerCase()
      .replace(/\s+/g, '-');           // Replace spaces with hyphens
  };
  
  let match;
  
  // Extract h2 headings
  while ((match = h2Regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = cleanMarkdownForId(text);
    headings.push({ level: 2, text, id });
  }
  
  // Extract h3 headings
  while ((match = h3Regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = cleanMarkdownForId(text);
    headings.push({ level: 3, text, id });
  }
  
  // Extract h4 headings
  while ((match = h4Regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = cleanMarkdownForId(text);
    headings.push({ level: 4, text, id });
  }
  
  return headings;
};

// Throttle function to limit how often a function can be called
function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
}

// Transform API articles into ArticleSection structure
const transformArticlesToSections = (articles: ArticleListItem[]): {
  ungroupedArticles: ArticleListItem[];
  groupedSections: ArticleSection[];
} => {
  // First, separate articles with empty group_name
  const ungroupedArticles = articles.filter(article => !article.group_name || article.group_name.trim() === '');
  const groupedArticlesArray = articles.filter(article => article.group_name && article.group_name.trim() !== '');
  
  // Group the remaining articles by group_name
  const groupedArticlesMap: Record<string, ArticleListItem[]> = {};
  groupedArticlesArray.forEach(article => {
    const groupName = article.group_name as string; // We've filtered out empty group_names
    if (!groupedArticlesMap[groupName]) {
      groupedArticlesMap[groupName] = [];
    }
    groupedArticlesMap[groupName].push(article);
  });
  
  // Create grouped sections
  const groupedSections: ArticleSection[] = [];
  
  // Add grouped articles to sections
  Object.entries(groupedArticlesMap).forEach(([groupName, groupArticles]) => {
    // Generate a URL-friendly ID from the group name
    const id = groupName.toLowerCase().replace(/\s+/g, '-');
    
    groupedSections.push({
      id,
      title: groupName,
      articles: groupArticles.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: '' // API doesn't provide excerpts
      }))
    });
  });
  
  return {
    ungroupedArticles,
    groupedSections
  };
};

export default function AdminArticlesPage() {
  const { isDark } = useTheme();
  const [selectedArticle, setSelectedArticle] = useState<SelectedArticle>({
    title: '',
    articleId: ''
  });
  const [articleContent, setArticleContent] = useState<string>('');
  const [articleTitle, setArticleTitle] = useState<string>('');
  const [ungroupedArticles, setUngroupedArticles] = useState<ArticleListItem[]>([]);
  const [groupedSections, setGroupedSections] = useState<ArticleSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Table of contents state
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [indicatorStyle, setIndicatorStyle] = useState({ top: '0px', height: '0px' });
  const contentRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const tocItemsRef = useRef<Record<string, HTMLElement>>({});
  
  // Store article previews - map article IDs to their content
  const [articlePreviews, setArticlePreviews] = useState<Record<string | number, string>>({});
  
  // Editor state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [editArticleTitle, setEditArticleTitle] = useState<string>('');
  const [articleGroup, setArticleGroup] = useState<string>('');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | string | null>(null);

  // Helper function to create a text excerpt
  const createExcerpt = (content: string, maxLength: number = 150): string => {
    if (!content) return 'No content available';
    
    return content
      .replace(/[#*`_~|<>]/g, '')  // Remove markdown symbols
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Replace markdown links with just the text
      .replace(/\n+/g, ' ')  // Replace newlines with spaces
      .substring(0, maxLength) + '...';
  };

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch articles from API
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const articleList = await methodologyApi.getArticlesList();
      console.log('Fetched article list:', articleList);
      
      // Transform API articles into sections
      const { ungroupedArticles: ungrouped, groupedSections: grouped } = transformArticlesToSections(articleList);
      
      // Set the article sections
      setUngroupedArticles(ungrouped);
      setGroupedSections(grouped);
      
      // Set first article as selected if available
      if (ungrouped.length > 0) {
        const firstArticle = ungrouped[0];
        // Ensure the article ID is valid
        if (firstArticle && firstArticle.id !== undefined && firstArticle.id !== null) {
          console.log('Setting initial selected article:', firstArticle.id);
          setSelectedArticle({
            title: firstArticle.title,
            articleId: firstArticle.id
          });
          fetchArticleContent(firstArticle.id);
        }
      } else if (grouped.length > 0 && grouped[0].articles.length > 0) {
        const firstArticle = grouped[0].articles[0];
        // Ensure the article ID is valid
        if (firstArticle && firstArticle.id !== undefined && firstArticle.id !== null) {
          console.log('Setting initial selected article:', firstArticle.id);
          setSelectedArticle({
            title: grouped[0].title,
            articleId: firstArticle.id
          });
          fetchArticleContent(firstArticle.id);
        }
      }
      
      setUsingMockData(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch articles. Please try again later.');
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Find the selected article content
  const fetchArticleContent = async (articleId: string | number) => {
    setLoading(true);
    setError(null);
    
    // Validate article ID
    if (articleId === null || 
        articleId === undefined || 
        articleId === 'NaN' || 
        (typeof articleId === 'string' && articleId.toLowerCase() === 'nan') ||
        (typeof articleId === 'number' && isNaN(articleId))) {
      console.error('Invalid article ID detected in fetchArticleContent:', articleId);
      setError('Invalid article ID');
      setLoading(false);
      return;
    }
    
    try {
      // Use the methodologyApi which handles both numeric and string IDs
      console.log('Fetching article with ID:', articleId);
      // Explicitly cast to Article type to access content property
      const articleData = await methodologyApi.getArticle(articleId) as Article;
      console.log('Fetched article:', articleData);
      setArticleContent(articleData.content || '');
      setArticleTitle(articleData.title);
      
      // Store article preview for this ID
      setArticlePreviews(prev => ({
        ...prev,
        [articleId]: articleData.content || ''
      }));
    } catch (err) {
      console.error('Error fetching article content:', err);
      setError('Failed to load article content');
      setArticleContent('');
      setArticleTitle('Article Not Found');
    } finally {
      setLoading(false);
    }
  };
  
  // Extract table of contents when article content changes
  useEffect(() => {
    if (articleContent) {
      const toc = extractTableOfContents(articleContent);
      setTableOfContents(toc);
      
      // Set first heading as active by default
      if (toc.length > 0) {
        setActiveHeading(toc[0].id);
      } else {
        setActiveHeading('');
      }
      
      // Reset TOC item refs
      tocItemsRef.current = {};
    }
  }, [articleContent]);

  // Store references to TOC items after render
  useEffect(() => {
    // Wait for the TOC items to be rendered
    setTimeout(() => {
      tableOfContents.forEach(heading => {
        const element = document.getElementById(`toc-${heading.id}`);
        if (element) {
          tocItemsRef.current[heading.id] = element;
        }
      });
      
      // Update indicator position for initial active heading
      if (activeHeading && tocItemsRef.current[activeHeading]) {
        updateIndicatorPosition(activeHeading);
      }
    }, 500);
  }, [tableOfContents]);

  // Update indicator style when active heading changes
  useEffect(() => {
    if (activeHeading && tocItemsRef.current[activeHeading]) {
      updateIndicatorPosition(activeHeading);
    }
  }, [activeHeading]);

  // Monitor scroll position to update active heading
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = throttle(() => {
      if (tableOfContents.length === 0) return;
      const visibleHeading = findMostVisibleHeading();
      if (visibleHeading && visibleHeading !== activeHeading) {
        setActiveHeading(visibleHeading);
      }
    }, 100);

    // Listen for scroll events on both the content div and the window
    content.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      content.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tableOfContents, activeHeading]);

  const updateIndicatorPosition = (headingId: string) => {
    const tocItem = tocItemsRef.current[headingId];
    if (!tocItem || !tocRef.current) return;
    
    const itemRect = tocItem.getBoundingClientRect();
    const tocRect = tocRef.current.getBoundingClientRect();
    
    // Calculate relative position
    const top = itemRect.top - tocRect.top;
    const height = itemRect.height;
    
    setIndicatorStyle({
      top: `${top}px`,
      height: `${height}px`
    });
  };

  const findMostVisibleHeading = () => {
    if (!contentRef.current) return '';
    
    const headings: {id: string, visibility: number}[] = [];
    
    // Find all heading elements in the content
    tableOfContents.forEach(toc => {
      const id = toc.id;
      const element = document.getElementById(id);
      
      if (element) {
        // Calculate how much of the element is visible in the viewport
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate visibility percentage
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, windowHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / rect.height;
        
        headings.push({ id, visibility });
      }
    });
    
    // Sort by visibility (most visible first)
    headings.sort((a, b) => b.visibility - a.visibility);
    
    // Return the most visible heading
    return headings.length > 0 ? headings[0].id : '';
  };

  const scrollToHeading = (headingId: string) => {
    const heading = document.getElementById(headingId);
    
    if (heading) {
      // Scroll to the heading with a small offset
      window.scrollTo({
        top: heading.offsetTop - 100,
        behavior: 'smooth'
      });
      
      // Update active heading
      setActiveHeading(headingId);
    }
  };

  // Fetch article content when selected article changes
  useEffect(() => {
    if (selectedArticle.articleId && !isEditing && !isCreating) {
      fetchArticleContent(selectedArticle.articleId);
    }
  }, [selectedArticle, isEditing, isCreating]);

  // Start editing an article
  const handleEdit = async (articleId: string | number) => {
    setLoading(true);
    
    try {
      const article = await methodologyApi.getArticle(articleId);
    setIsEditing(true);
    setIsCreating(false);
    setEditingArticle(article);
      setEditorContent(article.content || '');
      setEditArticleTitle(article.title);
      setArticleGroup(article.group_name || '');
    setSaveError(null);
    } catch (err) {
      console.error('Error fetching article for editing:', err);
      setError('Failed to load article for editing');
    } finally {
      setLoading(false);
    }
  };

  // Start creating a new article
  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingArticle(null);
    setEditorContent('');
    setEditArticleTitle('');
    setArticleGroup('');
    setSaveError(null);
  };

  // Cancel editing/creating
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingArticle(null);
    setEditorContent('');
    setEditArticleTitle('');
    setArticleGroup('');
    setSaveError(null);
  };

  // Save the article (create or update)
  const handleSave = async () => {
    if (!editArticleTitle.trim()) {
      setSaveError('Please enter a title');
      return;
    }

    setSaveLoading(true);
    setSaveError(null);
    
    try {
      if (isCreating) {
        // Create new article
        const newArticle = await methodologyApi.createArticle({
          title: editArticleTitle,
          content: editorContent,
          group_name: articleGroup.trim() || '' // Empty string instead of undefined
        });
        
        // Refresh article list
        await fetchArticles();
        
        // Reset form
        handleCancel();
      } else if (isEditing && editingArticle) {
        // Update existing article
        await methodologyApi.updateArticle(editingArticle.id, {
          title: editArticleTitle,
          content: editorContent,
          group_name: articleGroup.trim() || '' // Empty string instead of undefined
        });
        
        // Refresh article list
        await fetchArticles();
        
        // Reset form
        handleCancel();
      }
    } catch (err) {
      console.error('Error saving article:', err);
      setSaveError('Failed to save article. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete an article
  const handleDelete = async (id: number | string) => {
    setLoading(true);
    setError(null);
    
    try {
      await methodologyApi.deleteArticle(id);
      
      // Refresh article list
      await fetchArticles();
      
      // Clear delete confirmation
      setDeleteConfirm(null);
    } catch (err) {
      console.error(`Error deleting article with ID ${id}:`, err);
      setError(`Failed to delete article with ID ${id}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Quill editor modules configuration
  const editorModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'code-block', 'blockquote'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['clean']
    ],
    clipboard: {
      // Allow pasting content from Word, Google Docs, etc.
      matchVisual: false
    }
  };

  // Render the markdown content
  const renderMarkdown = (content: string): JSX.Element => {
    // Check if content contains HTML tags
    const containsHTML = /<[a-z][\s\S]*>/i.test(content);
    
    if (containsHTML) {
      // If content contains HTML, sanitize it with DOMPurify before rendering
      const sanitizedHTML = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target'] // Allow target attribute for links
      });
      
      return (
        <div 
          className="markdown-content" 
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      );
    }
    
    // For markdown content, use ReactMarkdown with remarkGfm plugin
    return (
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  // Render the editor
  const renderEditor = () => {
    return (
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow mb-6`}>
        <div className="mb-6">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isCreating ? 'Create New Article' : 'Edit Article'}
          </h2>
          
          {saveError && (
            <div className={`p-3 mb-4 rounded-md flex items-center ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
              <AlertCircle className="h-4 w-4 mr-2" />
              {saveError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Title
              </label>
              <Input
                value={editArticleTitle}
                onChange={(e) => setEditArticleTitle(e.target.value)}
                placeholder="Article title"
                className={isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}
              />
            </div>
            
            <div>
              <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Group Name (Optional)
              </label>
              <Input
                value={articleGroup}
                onChange={(e) => setArticleGroup(e.target.value)}
                placeholder="Leave empty to display at root level"
                className={isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}
              />
            </div>
            
            <div>
              <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Content
              </label>
              <div className={isDark ? 'quill-dark' : 'quill-light'}>
                <ReactQuill
                  theme="snow"
                  value={editorContent}
                  onChange={setEditorContent}
                  modules={editorModules}
                  className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className={isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saveLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the article list
  const renderArticleList = () => {
    if (loading && ungroupedArticles.length === 0) {
      return (
        <div className="flex justify-center my-8">
          <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
        </div>
      );
    }

    if (ungroupedArticles.length === 0) {
      return (
        <div className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No articles found. Click "Add Article" to create one.
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {ungroupedArticles.map(article => (
          <div 
            key={article.id} 
            className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {article.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {article.group_name || 'Uncategorized'}
                </p>
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {articlePreviews[article.id] 
                    ? createExcerpt(articlePreviews[article.id])
                    : 'Loading preview...'}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(article.id)}
                  className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                {deleteConfirm === article.id ? (
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeleteConfirm(null)}
                      className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDeleteConfirm(article.id)}
                    className={isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 hover:text-red-500'}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render admin UI
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Add Article button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Article Management
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Create, edit, and manage methodology articles
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Link href="/academy">
              <Button variant="outline" className={`${isDark ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}>
                View Articles
              </Button>
            </Link>
            
            {!isEditing && !isCreating && (
              <Button 
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className={`p-4 rounded-md ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'} mb-6`}>
            {error}
          </div>
        )}

        {usingMockData && (
          <div className={`p-4 rounded-md ${isDark ? 'bg-yellow-900/30 text-yellow-200' : 'bg-yellow-50 text-yellow-800'} mb-6`}>
            Using mock data - API is not available. Changes won't be persisted.
          </div>
        )}

        {/* Editor Panel */}
        {(isEditing || isCreating) ? (
          renderEditor()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar (Articles) */}
            <div className="md:col-span-3">
                                <aside className={`sidebar p-4 rounded-lg sticky top-24 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <h2 className="text-xl font-bold mb-4">Article Library</h2>
                
                <div className="space-y-4">
                  {/* Articles List */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">All Articles</h3>
                    {renderArticleList()}
                  </div>
                  
                  {/* Article Sections */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Categorized Articles</h3>
                    
                    {groupedSections.length > 0 ? (
                      <div className="space-y-2">
                        {groupedSections.map(section => (
                          <div key={section.id} className="mb-2">
                            {/* Section Header */}
                            <div
                              className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                              onClick={() => toggleSection(section.id)}
                            >
                              <span className="font-medium text-sm">{section.title}</span>
                              <span>{expandedSections[section.id] ? '−' : '+'}</span>
                            </div>
                            
                            {/* Section Articles */}
                            {expandedSections[section.id] && (
                              <ul className="ml-3 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-600">
                                {section.articles.map(article => (
                                  <li key={`grouped-${article.id}`} className="group relative">
                                    <button
                                      className={`block w-full text-left pl-4 py-2 text-sm ${
                                        selectedArticle.articleId === article.id ? 
                                        'font-semibold' : 'opacity-80 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                                      }`}
                                      onClick={() => setSelectedArticle({
                                        title: section.title,
                                        articleId: article.id
                                      })}
                                    >
                                      {article.title}
                                      {articlePreviews[article.id] && (
                                        <span className="block text-xs opacity-70 mt-1 pr-16">
                                          {createExcerpt(articlePreviews[article.id], 80)}
                                        </span>
                                      )}
                                    </button>
                                    <div className="absolute right-2 top-1.5 hidden group-hover:flex">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEdit(article.id);
                                        }}
                                        className="h-6 w-6 p-1"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      {deleteConfirm === article.id ? (
                                        <>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDelete(article.id);
                                            }}
                                            className="h-6 w-6 p-1 text-red-500"
                                          >
                                            <Check className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDeleteConfirm(null);
                                            }}
                                            className="h-6 w-6 p-1"
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </>
                                      ) : (
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirm(article.id);
                                          }}
                                          className="h-6 w-6 p-1 text-red-500"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No categories found
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-6">
              <article className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <header className="mb-6 pb-6 border-b flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold">{articleTitle}</h1>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {selectedArticle.title}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(selectedArticle.articleId)}
                      className={`${isDark ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    {deleteConfirm === selectedArticle.articleId ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(selectedArticle.articleId)}
                          className="border-red-500 text-red-500"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(null)}
                          className={`${isDark ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(selectedArticle.articleId)}
                        className="border-red-500 text-red-500"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </header>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-6 py-4 rounded">
                    <h3 className="font-semibold">Error</h3>
                    <p>{error}</p>
                  </div>
                ) : (
                  <div 
                    ref={contentRef}
                    className="prose prose-lg dark:prose-invert max-w-none pr-4 min-h-[400px]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {renderMarkdown(articleContent)}
                  </div>
                )}
              </article>
            </div>
            
            {/* Table of Contents */}
            <div className="md:col-span-3">
              <div className={`p-4 rounded-lg sticky top-24 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                
                {tableOfContents.length > 0 ? (
                  <div className="relative" ref={tocRef}>
                    {/* Active indicator */}
                    <div
                      className="absolute left-0 w-1 bg-blue-500 rounded transition-all duration-200"
                      style={indicatorStyle}
                    />
                    
                    {/* TOC items */}
                                            <ul className="space-y-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          {tableOfContents.map((item) => (
                        <li
                          key={item.id}
                          id={`toc-${item.id}`}
                          className={`cursor-pointer transition-colors ${
                            activeHeading === item.id ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                          }`}
                          style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                          onClick={() => scrollToHeading(item.id)}
                        >
                          <span className="block py-1 pl-3 border-l-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                            {/* Render markdown in TOC item text */}
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({node, ...props}) => <span {...props} />
                              }}
                            >
                              {item.text}
                            </ReactMarkdown>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm opacity-70">No sections found in this article.</p>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold mb-2">Related Resources</h4>
                  <ul className="text-sm space-y-2">
                    <li>
                      <Link href="/academy/financial-terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Financial Terms Glossary
                      </Link>
                    </li>
                    <li>
                      <Link href="/screener" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Stock Screener
                      </Link>
                    </li>
                    <li>
                      <Link href="/portfolio" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Portfolio Analysis
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <style jsx global>{`
          .quill-dark .ql-toolbar {
            background-color: #374151;
            border-color: #4B5563;
          }
          
          .quill-dark .ql-container {
            background-color: #1F2937;
            border-color: #4B5563;
            color: #F9FAFB;
          }
          
          .quill-dark .ql-editor {
            min-height: 300px;
          }
          
          .quill-dark .ql-picker {
            color: #E5E7EB;
          }
          
          .quill-dark .ql-stroke {
            stroke: #E5E7EB;
          }
          
          .quill-dark .ql-fill {
            fill: #E5E7EB;
          }
          
          .quill-light .ql-editor {
            min-height: 300px;
          }
          
          /* Add scrollbar hiding styles globally */
          aside::-webkit-scrollbar {
            display: none;
          }
          
          div.prose::-webkit-scrollbar {
            display: none;
          }
          
          ul::-webkit-scrollbar {
            display: none;
          }

          /* Markdown Styling */
          .markdown-content h1 {
            font-size: 2rem;
            font-weight: 700;
            margin: 1.5rem 0 1rem;
          }
          
          .markdown-content h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 1.5rem 0 1rem;
          }
          
          .markdown-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.25rem 0 0.75rem;
          }
          
          .markdown-content h4 {
            font-size: 1.125rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem;
          }
          
          .markdown-content p {
            margin: 0.75rem 0;
            line-height: 1.6;
          }
          
          .markdown-content ul, .markdown-content ol {
            margin: 0.75rem 0 0.75rem 1.5rem;
          }
          
          .markdown-content ul {
            list-style-type: disc;
          }
          
          .markdown-content ol {
            list-style-type: decimal;
          }
          
          .markdown-content li {
            margin: 0.25rem 0;
          }
          
          .markdown-content a {
            color: #3B82F6;
            text-decoration: none;
          }
          
          .markdown-content a:hover {
            text-decoration: underline;
          }
          
          .markdown-content blockquote {
            border-left: 4px solid #CBD5E1;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
          }
          
          .markdown-content code {
            background-color: #F1F5F9;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: monospace;
          }
          
          .dark .markdown-content code {
            background-color: #1E293B;
          }
          
          .markdown-content pre {
            background-color: #F1F5F9;
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          
          .dark .markdown-content pre {
            background-color: #1E293B;
          }
          
          .markdown-content pre code {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
          }
          
          .markdown-content img {
            max-width: 100%;
            border-radius: 0.375rem;
            margin: 1rem 0;
          }
          
          .markdown-content hr {
            border: 0;
            border-top: 1px solid #E2E8F0;
            margin: 1.5rem 0;
          }
          
          .dark .markdown-content hr {
            border-top-color: #334155;
          }
        `}</style>
      </div>
    </MainLayout>
  );
} 