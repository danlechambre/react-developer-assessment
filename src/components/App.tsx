import { mapValues, uniqWith } from 'lodash';
import { useEffect, useState } from 'react';

/*
1. Setting up some types, I prefer to keep types close to where I'll be using
them so 'App' is fine for this exercise
*/
interface Author {
  name: string;
  avatar: string;
}

interface Category {
  id: string;
  name: string;
}

interface PostData {
  id: string;
  title: string;
  publishDate: string;
  author: Author;
  summary: string;
  categories: Category[];
}

/*
2. Let's set up a function to fetch our posts
in existing projects - axios is almost always ready and waiting
but I think the browser's fetch API is fine here
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
NB. I could bring in 'date-fns' or similar to make sure we're checking for an actual date,
handling errors etc. but this feels appropriate for the exercise
*/
function getDateString(date: string) {
  const dt = new Date(date);
  return dt.toLocaleDateString();
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

  const handleUpdateCategoryFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFilterCategories((prevState) => ({
      ...prevState,
      [value]: checked,
    }));
  };

  const handleClearSelection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const resetObj = mapValues({ ...filterCategories }, () => false);
    setFilterCategories(resetObj);
  };

  const filterFn = (post: PostData) => {
    if (Object.values(filterCategories).includes(true)) {
      return post.categories.some((c) => filterCategories[c.name]);
    }

    return true;
  };

  return (
    <main>
      <h1>Awesome Posts</h1>
      <section>
        <ul>
          {posts.filter(filterFn).map((post) => (
            <li key={post.id}>
              <article>
                <h2>{post.title}</h2>
                <div>
                  <img src={post.author.avatar} alt="Author avatar" />
                  <span>{post.author.name}</span>
                  <time dateTime={post.publishDate}>{getDateString(post.publishDate)}</time>
                </div>
                <p>{post.summary}</p>
                {post.categories.length > 0 && (
                  <footer>
                    <h3>Categories</h3>
                    <ul>
                      {post.categories.map((cat, i) => (
                        <li key={`category-${i}`}>{cat.name}</li>
                      ))}
                    </ul>
                  </footer>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <fieldset>
          <legend>Filter by category&colon;</legend>
          {categories.map((category) => (
            <div key={category.id}>
              <input
                type="checkbox"
                id={category.id}
                name="categories"
                value={category.name}
                onChange={handleUpdateCategoryFilter}
                checked={filterCategories[category.name] ?? false}
              />
              <label htmlFor={category.id}>{category.name}</label>
            </div>
          ))}
        </fieldset>

        <button type="button" onClick={handleClearSelection}>
          Clear Selection
        </button>
      </section>
    </main>
  );
};

export default App;
