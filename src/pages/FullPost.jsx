import React from "react";
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

import axios from '../axios';
import { useSelector } from "react-redux";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [commentText, setCommentText] = React.useState('');
  const [likes, setLikes] = React.useState(0);
  const [liked, setLiked] = React.useState(false);

  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`/posts/${id}`)
      .then(res => {
        setData(res.data);
        setLikes(res.data.likes || 0);
        setLiked(false);
        setLoading(false);
      })
      .catch(err => {
        console.warn(err);
        alert('Ошибка при получении статьи');
        setLoading(false);
      });

    axios.get(`/api/posts/${id}/comments`)
      .then(res => setComments(res.data))
      .catch(err => {
        console.warn(err);
        alert('Ошибка при получении комментариев');
      });
  }, [id]);

  const handleAddComment = async () => {
    try {
      const { data: newComment } = await axios.post(`/api/posts/${id}/comments`, {
        text: commentText,
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.warn(err);
      alert('Не удалось отправить комментарий');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;

    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.warn(err);
      alert('Ошибка при удалении комментария');
    }
  };

  const handleToggleLike = async () => {
    try {
      if (liked) {
        const res = await axios.delete(`/posts/${id}/like`);
        setLikes(res.data.likes);
        setLiked(false);
      } else {
        const res = await axios.post(`/posts/${id}/like`);
        setLikes(res.data.likes);
        setLiked(true);
      }
    } catch (err) {
      console.warn(err);
      alert('Ошибка при изменении лайка');
    }
  };

  if (isLoading) {
    return <Post isLoading={true} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={{
          ...data.user,
          fullName: (
            <a href={`/user/${data.user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {data.user.fullName}
            </a>
          ),
        }}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown>{data.text}</ReactMarkdown>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
          <button
            onClick={handleToggleLike}
            style={{
              background: 'none',
              border: 'none',
              color: liked ? 'red' : 'gray',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            <FavoriteIcon />
            <span style={{ marginLeft: 4 }}>{likes}</span>
          </button>
        </div>
      </Post>

      <CommentsBlock
        items={comments}
        isLoading={false}
        onDelete={handleDeleteComment}
        currentUserId={userData?._id}
      >
        {userData && (
          <Index
            user={userData}
            text={commentText}
            setText={setCommentText}
            onSubmit={handleAddComment}
          />
        )}
      </CommentsBlock>
    </>
  );
};
