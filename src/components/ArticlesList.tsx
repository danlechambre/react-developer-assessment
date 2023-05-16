import { Link } from 'react-router-dom';
import styles from '../styles/ArticlesList.module.css';
import Article from './Article';
import { PostData } from './ArticlesPage';

interface ArticlesListProps {
  posts: PostData[];
  filterFn: (post: PostData) => boolean;
}

const ArticlesList = ({ posts, filterFn }: ArticlesListProps) => {
  return (
    <ul className={styles.articleList}>
      {posts.filter(filterFn).map((post) => (
        <li className={styles.articleListItem} key={post.id}>
          <Article post={post} />
        </li>
      ))}
    </ul>
  );
};

export default ArticlesList;
