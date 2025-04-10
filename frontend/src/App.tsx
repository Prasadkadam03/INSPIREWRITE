import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Blog } from './pages/Blog';
import { Blogs } from './pages/Blogs';
import { Publish } from './pages/Publish';
import {UpdateUser} from './pages/UpdateUser';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Signin />} /> 
        <Route path="/signin" element={<Signin />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/blogs" element={<Blogs/>} />
        <Route path="/" element={<Blogs/>} />
        <Route path="/publish" element={<Publish/>} />
        <Route path='/updateUser' element={<UpdateUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
