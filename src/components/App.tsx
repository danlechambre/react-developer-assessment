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

const App: React.FC = () => {
  // 3. Set up a simple state/effect combo for getting the posts
  const [posts, setPosts] = useState<PostData[] | []>([]);
  useEffect(() => {
    getPosts().then((posts) => setPosts(posts));
  }, []);

  return (
    <main>
      <h1>Awesome Posts</h1>
      <section>
        <ul>
          {posts.map((post) => (
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
                      {post.categories.map((cat) => (
                        <li>{cat.name}</li>
                      ))}
                    </ul>
                  </footer>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default App;
