import React from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios'

import { Post } from '../../components/Post';
import { Container, Avatar, Typography, Divider } from '@mui/material';
import { Footer } from '../../components/Footer';

export const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`/auth/user/${id}`),
          axios.get(`/posts?user=${id}`)
        ]);
        setUser(userRes.data);
        setPosts(postsRes.data);
        setLoading(false);
      } catch (err) {
        console.warn(err);
        alert('Ошибка при загрузке данных пользователя');
      }
    };

    fetchData();
  }, [id]);

  if (isLoading || !user) {
    return <Typography variant="h5" color="#ff6be3">Загрузка...</Typography>;
  }

  return (
    <>
      <Container maxWidth="md">
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
          <Avatar
            src={user.avatarUrl}
            alt={user.fullName}
            sx={{ width: 80, height: 80, marginRight: 2 }}
          />
          <div>
            <Typography variant="h5">{user.fullName}</Typography>
          </div>
        </div>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Посты пользователя:
        </Typography>
        {posts.map((post) => (
          <Post
            key={post._id}
            id={post._id}
            title={post.title}
            imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ''}
            user={post.user}
            createdAt={post.createdAt}
            viewsCount={post.viewsCount}
            commentsCount={post.comments?.length || 0}
            tags={post.tags}
            isEditable={false}
          />
        ))}
      </Container>
      <Footer />
    </>
  );
};
