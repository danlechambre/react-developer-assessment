import { useEffect, useState } from 'react';
import CategoryFilter from './CategoryFilter';
import styles from '../styles/ArticlesPage.module.css';
import Article from './Article';
import { uniqWith } from 'lodash';

export interface Author {
  name: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PostData {
  id: string;
  title: string;
  publishDate: string;
  author: Author;
  summary: string;
  categories: Category[];
}

export function getPosts(): Promise<PostData[]> {
  return fetch('/api/posts')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((json) => {
      return json.posts as PostData[];
    });
}

function getCategories(posts: PostData[]) {
  const categories = posts.map((post) => post.categories).flat();
  return uniqWith(categories, (a, b) => a.name === b.name);
}

const ArticlesPage = () => {
  const [posts, setPosts] = useState<PostData[] | []>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getPosts().then((posts) => {
      setCategories(getCategories(posts));
      setPosts(posts);
    });
  }, []);

  const [filterCategories, setFilterCategories] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const obj: Record<string, boolean> = {};
    categories.forEach((category) => {
      obj[category.name] = false;
    });
    setFilterCategories(obj);
  }, [categories]);

  const filterFn = (post: PostData) => {
    if (Object.values(filterCategories).includes(true)) {
      return post.categories.some((c) => filterCategories[c.name]);
    }

    return true;
  };

  return (
    <div className={styles.flexContainer}>
      <section>
        <ul className={styles.articleList}>
          {posts.filter(filterFn).map((post) => (
            <li className={styles.articleListItem} key={post.id}>
              <Article post={post} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <CategoryFilter
          categories={categories}
          filter={filterCategories}
          setFilter={setFilterCategories}
        />
      </section>
    </div>
  );
};

export default ArticlesPage;
