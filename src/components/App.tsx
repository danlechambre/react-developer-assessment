import { uniqWith } from 'lodash';
import { useEffect, useState } from 'react';
import Article from './Article';
import CategoryFilter from './CategoryFilter';
import styles from '../styles/App.module.css';

/*
1. Setting up some types, I prefer to keep types close to where I'll be using
them so 'App' is fine for this exercise
*/
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

/*
2. Let's set up a function to fetch our posts -
in existing projects - axios is almost always ready and waiting
but I think the browser's fetch API is fine for this exercise
*/
function getPosts(): Promise<PostData[]> {
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

/*
4. Categories on posts all have unique IDs - 
in a real world scenario you'd expect categories appearing across multiple posts to have the same ID.
I brought lodash in to do this for me as I didn't want to lose too much time on this issue
*/
function getCategories(posts: PostData[]) {
  const categories = posts.map((post) => post.categories).flat();
  return uniqWith(categories, (a, b) => a.name === b.name);
}

const App: React.FC = () => {
  // 3. Set up a simple state/effect combo for getting the posts
  const [posts, setPosts] = useState<PostData[] | []>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getPosts().then((posts) => {
      setCategories(getCategories(posts));
      setPosts(posts);
    });
  }, []);

  /* 
  5. I could have easily implemented a single category filter - but wanted to challenge myself to set up multi-select
  Ordinarily - I would have brought in a headless component (e.g. Headless UI), but wanted to try for a mostly native implementation
  using standard checkboxes.
  */
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
    <div className={styles.appContainer}>
      <main className={styles.wrapper}>
        <h1 className={styles.heading}>Awesome Posts</h1>
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
      </main>
    </div>
  );
};

export default App;
