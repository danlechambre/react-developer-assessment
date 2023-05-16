import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import ArticlePage from './ArticlePage';
import ArticlesPage from './ArticlesPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ArticlesPage />} />
          <Route path="posts/:postId" element={<ArticlePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
