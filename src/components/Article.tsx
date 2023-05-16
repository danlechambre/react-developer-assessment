import React from 'react';
import { PostData } from './App';
import styles from '../styles/Article.module.css';

interface ArticleProps {
  post: PostData;
}

/*
NB. I could bring in 'date-fns' or similar to make sure we're checking for an actual date,
handling errors etc. but this feels appropriate for the exercise
*/
function getDateString(date: string) {
  const dt = new Date(date);
  return dt.toLocaleDateString();
}

const Article = ({ post }: ArticleProps) => {
  return (
    <article className={styles.article}>
      <h2>{post.title}</h2>
      <div className={styles.postDetailsWrapper}>
        <img className={styles.avatar} src={post.author.avatar} alt="Author avatar" />
        <span className={styles.label}>{post.author.name}</span>
        <time className={styles.label} dateTime={post.publishDate}>
          {getDateString(post.publishDate)}
        </time>
      </div>
      <p>{post.summary}</p>
      {post.categories.length > 0 && (
        <footer>
          <h3 className={styles.categoriesHeading}>Categories:</h3>
          <ul className={styles.categoriesList}>
            {post.categories.map((cat, i) => (
              <li className={styles.categoriesListItem} key={`category-${i}`}>
                {cat.name}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  );
};

export default Article;
