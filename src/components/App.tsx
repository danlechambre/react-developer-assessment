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

const App: React.FC = () => {
  // 3. Set up a simple state/effect combo for getting the posts
  const [posts, setPosts] = useState<PostData[] | []>([]);
  useEffect(() => {
    getPosts().then((posts) => setPosts(posts));
  }, []);

  return (
    <div>
      {/* 4. test we're getting data. */}
      {posts.map((post) => (
        <div>{post.title}</div>
      ))}
    </div>
  );
};

export default App;
