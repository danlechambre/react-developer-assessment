import styles from '../styles/ArticlesList.module.css';
import Article from './Article';
import { PostData } from './ArticlesPage';
import { createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface ArticlesListProps {
  posts: PostData[];
  filterFn: (post: PostData) => boolean;
}

const ArticlesList = ({ posts, filterFn }: ArticlesListProps) => {
  const postsWithNodeRef = posts.map((p) => ({ ...p, nodeRef: createRef<any>() }));

  return (
    <TransitionGroup className={`nodes-container ${styles.articleList}`} component="ul">
      {postsWithNodeRef.filter(filterFn).map((post) => (
        <CSSTransition
          key={post.id}
          nodeRef={post.nodeRef}
          timeout={1000}
          classNames="list-item-transition"
        >
          <li className={styles.articleListItem} ref={post.nodeRef}>
            <Article post={post} />
          </li>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default ArticlesList;
