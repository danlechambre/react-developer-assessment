import { Link, useParams } from 'react-router-dom';
import { PostData, getPosts } from './ArticlesPage';
import { useEffect, useState } from 'react';

function getPost(id: any) {
  return getPosts().then((data) => {
    return data.find((p) => p.id === id) as PostData;
  });
}

const ArticlePage = () => {
  const { postId } = useParams();

  const [post, setPost] = useState<PostData | undefined>();
  useEffect(() => {
    getPost(postId).then((post) => setPost(post));
  }, [postId]);

  return (
    <div>
      <h2>{post?.title}</h2>
      <p>{post?.author.name}</p>
      <Link to="/">Back to articles</Link>
    </div>
  );
};

export default ArticlePage;
