import React, { useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        // 可以发送一个简单的验证请求来检查 token 是否有效
        await axiosInstance.get('/api/platform-types/1');
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      checkToken();
    }
  }, [navigate]);

  return (
    <div className="App">
      <Button type="primary">Button</Button>
    </div>
  );
};

export default App;