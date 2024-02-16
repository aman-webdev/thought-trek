import { createContext, useState } from "react";
import { Blog, Comment, Vote } from "../interfaces/interface";

interface BlogContextInterface {
  blogs: Blog[],
  setBlogs:React.Dispatch<React.SetStateAction<Blog[]>> ,
  selectedBlog: Blog | null,
  setSelectedBlog:React.Dispatch<React.SetStateAction<Blog | null>> ,
  likeBlog:(userId:string)=>void;
  createBlogComment:(userId:string,comment:string)=>void;
  likeBlogComment : (commentId: string, userId: string) =>void;
  deleteBlogComment : (commentId:string) => void;
}

const BlogContext = createContext<BlogContextInterface | any>(null);

export const BlogContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const likeBlog = (userId: string) => {
    if (!selectedBlog || !selectedBlog._id) return;
    const blog = { ...selectedBlog };

    const hasUserLiked = !blog.likes
      ? false
      : blog.likes.find((like) => like._userId === userId);


    const newLikeData: Vote = {
      _userId: userId,
      parentId: selectedBlog._id,
      parentType: "Blog" as const,
    };

    const updatedLikes = !hasUserLiked
      ? [...(blog.likes || []), newLikeData]
      : blog.likes!.filter((like) => like._userId !== userId);

    let updatedLikeCount = 1;
    if (!hasUserLiked)
      updatedLikeCount = blog.totalLikes ? blog.totalLikes + 1 : 1;
    else updatedLikeCount = blog.totalLikes ? blog.totalLikes - 1 : 0;

    const updatedBlogData: Blog = {
      ...blog,
      totalLikes: updatedLikeCount,
      likes: updatedLikes,
    };

    console.log(updatedBlogData,"testing update")

    const updated = blogs.map((blog) =>
      blog._id === selectedBlog._id ? updatedBlogData : blog
    );
    setBlogs(updated);
    setSelectedBlog(updatedBlogData);
  };


  const createBlogComment = (userId: string, comment: string) => {
    console.log(comment,"comment")
    if (!selectedBlog || !selectedBlog._id) return;

    const newCommentData = {
      comment,
      _blogId: selectedBlog._id,
      _userId: userId,
      totalLikes: 0,
      likes: [],
    };

    const updatedBlogData: Blog = {
      ...selectedBlog,
      ...(selectedBlog.comments
        ? { comments: [ newCommentData,...selectedBlog.comments] }
        : { comments: [newCommentData] }),
    };


    const updatedBlogs = blogs.map((blog) =>
      blog._id === selectedBlog._id ? updatedBlogData : blog
    );
    setSelectedBlog(updatedBlogData);
    setBlogs(updatedBlogs);
  };


  const likeBlogComment = ( userId: string,commentId: string) => {
    if (!selectedBlog) return;

    const selBlog = { ...selectedBlog };

    if (!selBlog.comments || !selBlog._id) return;

    const selectedComment = selBlog.comments.find(
      (comm) => comm._id === commentId
    );
    if (!selectedComment) return;

    const updatedCommentData: Comment = selectedComment;
    const newLike: Vote = {
      parentId: commentId,
      parentType: "Comment" as const,
      _userId: userId,
    };

    const hasUserLiked = !updatedCommentData.likes
      ? false
      : updatedCommentData.likes.find((like) => like._userId === userId);

    const updatedLikes = !hasUserLiked
      ? [...(updatedCommentData.likes || []), newLike]
      : updatedCommentData.likes!.filter((like) => like._userId !== userId);

    let updatedLikeCount = 1;
    if (!hasUserLiked)
      updatedLikeCount = updatedCommentData.totalLikes
        ? updatedCommentData.totalLikes + 1
        : 1;
    else
      updatedLikeCount = updatedCommentData.totalLikes
        ? updatedCommentData.totalLikes - 1
        : 0;

    updatedCommentData.likes = updatedLikes;
    updatedCommentData.totalLikes = updatedLikeCount;

    const updatedBlogComments = selBlog.comments.map((comm) =>
      comm._id === commentId ? updatedCommentData : comm
    );
    const updatedBlogs = blogs.map((blog) =>
      blog._id === selBlog._id
        ? { ...blog, comments: updatedBlogComments }
        : blog
    );
    setBlogs(updatedBlogs);
    setSelectedBlog(selBlog);
  };

  const deleteBlogComment = (commentId: string) => {
    if (!selectedBlog) return;
    const selBlog: Blog = { ...selectedBlog };
    if (!selBlog._id || !selBlog.comments) return;

    const updatedComments = selBlog.comments.filter(
      (comm) => comm._id !== commentId
    );


    const updatedBlogs = blogs.map((blog) =>
      blog._id === selBlog._id ? { ...blog, comments: updatedComments } : blog
    );
    setBlogs(updatedBlogs);
    setSelectedBlog({ ...selBlog, comments: updatedComments });
  };

  const editBlogComment = (commentId:string, comment:string) => {
    if(!selectedBlog) return;
    const selBlog = {...selectedBlog}
    const updatedComments = selBlog.comments!.map(comm=>comm._id === commentId ? {...comm , comment} : comm)
    setSelectedBlog({...selectedBlog,comments:updatedComments})

  }


  const providerValue = {
    blogs,
    selectedBlog,
    likeBlog,
    createBlogComment,
    likeBlogComment,deleteBlogComment ,
    setBlogs , setSelectedBlog , 
    editBlogComment
  };

  return <BlogContext.Provider value={providerValue}>{children}</BlogContext.Provider>;
};


export default BlogContext;